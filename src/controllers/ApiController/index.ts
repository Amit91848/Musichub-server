import { refreshAccessToken } from "../../utils/services";
import { findProfileOfUser } from "../ProfileController";
import { getSpotifyPlaylists } from "./spotify";
import { getYoutubePlaylists } from "./youtube";
import { getSoundcloudPlaylists } from "./soundcloud";
import { CommonPlaylist, service } from "../../types";
import { mapSpotifyToCommonFormat, mapYoutubeToCommonFormat } from "../../utils/map";
import { getCustomPlaylists } from "./custom";

export const getAllPlaylists = async (userId: string, service: service): Promise<CommonPlaylist[]> => {
    const profile = await findProfileOfUser(userId, service);
    if (!profile) {
        return [];
    }
    let { accessToken, refreshToken, oauthId } = profile;
    let playlists;

    if (Date.now() as any > profile.expiresIn as any) {
        try {
            const token = await refreshAccessToken(refreshToken, profile?._id, service)
            accessToken = token;
        } catch (err) {
            console.log('error in refreshing accessTOken: ', err)
        }
    }

    if (service === 'spotify') {
        playlists = await getSpotifyPlaylists(accessToken, oauthId);
        return mapSpotifyToCommonFormat(playlists);
    } else if (service === 'youtube') {
        playlists = await getYoutubePlaylists(userId);
        return mapYoutubeToCommonFormat(playlists);
    } else if (service === 'soundcloud') {
        playlists = await getSoundcloudPlaylists(accessToken, oauthId);
        return playlists;
    } else if (service === 'custom') {
        playlists = await getCustomPlaylists(userId);
    }
    return [];
}