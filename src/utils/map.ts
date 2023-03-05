import { Document, Types } from "mongoose";
import { CommonPlaylist, CommonTracks } from "../types";
import { SpotifyPlaylist, SpotifyTracksShort } from "../types/spotify";
import { youtubePlaylistItemsResponse, youtubePlaylistResponse, youtubeSearchQuery } from "../types/youtube";
import { IProfile } from "../schema/Profile";
import { getYoutubeVideoLength } from "../controllers/ApiController/youtube";

export const mapSpotifyTracksToCommonTracks = (tracks: SpotifyTracksShort[]): CommonTracks[] => {
    return tracks?.map(track => {
        return {
            album: {
                id: track.track.album.id,
                title: track.track.album.name
            },
            artist: track.track.artists,
            duration: track.track.duration_ms,
            title: track.track.name,
            img: track.track.album.images,
            source: 'spotify',
            id: track.track.id,
        }
    })
}

export const mapSpotifySearchTracksToCommonTracks = (tracks: SpotifyTracksShort["track"][]): CommonTracks[] => {
    return tracks?.map(track => {
        return {
            album: {
                id: track.album.id,
                title: track.album.name
            },
            artist: track.artists,
            duration: track.duration_ms,
            title: track.name,
            img: track.album.images,
            source: 'spotify',
            id: track.id
        }
    })
}

export const mapYoutubePlaylistItemsToCommonTracks = (tracks: youtubePlaylistItemsResponse[]): CommonTracks[] => {
    return tracks?.map(track => {
        return {
            album: {
                id: track.id,
                title: track.snippet.title
            },
            artist: [{
                id: track.snippet.channelId,
                name: track.snippet.videoOwnerChannelTitle
            }],
            duration: 0,
            title: track.snippet.title,
            img: mapYoutubeThumbnailsToCommonTracksImg(track.snippet.thumbnails),
            source: 'youtube',
            id: track.contentDetails.videoId
        }
    })
}

export const mapYoutubeQueryResultToCommonTracks = (queryResults: youtubeSearchQuery[]): CommonTracks[] => {
    return queryResults?.map((query) => {
        return {
            album: {
                id: query.id.videoId,
                title: query.snippet.title,
            },
            artist: [{
                id: query.snippet.channelId,
                name: query.snippet.channelTitle
            }],
            duration: 0,
            title: query.snippet.title,
            img: mapYoutubeThumbnailsToCommonTracksImg(query.snippet.thumbnails),
            source: 'youtube',
            id: query.id.videoId
        }
    })
}

export const mapYoutubeThumbnailsToCommonTracksImg = (thumbnails: youtubePlaylistItemsResponse["snippet"]["thumbnails"]): CommonTracks["img"] => {
    return Object.values(thumbnails).map(({ url, width, height }) => {
        return {
            url,
            width,
            height
        }
    })
}

export const mapSpotifyToCommonFormat = (playlists: SpotifyPlaylist[]): CommonPlaylist[] => {
    return playlists?.map(playlist => {
        return {
            playlistId: playlist.id,
            description: playlist.description,
            img: playlist.images,
            name: playlist.name,
            isConnected: true,
            isStarred: false,
            total: playlist.tracks.total,
            tracks: [],
            source: 'spotify'
        };
    })
}

export const mapYoutubeToCommonFormat = (playlists: youtubePlaylistResponse[]): CommonPlaylist[] => {
    return playlists?.map(playlist => {
        return {
            playlistId: playlist.id,
            name: playlist.snippet.title,
            description: playlist.snippet.description,
            img: mapYoutubeThumbnailsToCommonTracksImg(playlist.snippet.thumbnails),
            isConnected: true,
            isStarred: false,
            total: playlist.contentDetails.itemCount,
            tracks: [],
            source: 'youtube'
        }
    })
}

export const mapYoutubeVideoDurationToPlaylistItems = async (items: CommonTracks[], userId: string): Promise<CommonTracks[]> => {
    let idsString = '';
    items.forEach(async (item) => {
        idsString += item.id + ','
    })
    const videoQueries = await getYoutubeVideoLength(idsString, userId);
    for (const query of videoQueries) {
        // find the corresponding CommonTracks object by id
        const video = items.find(v => v.id === query.id);
        if (video) {
            // set the duration property of the CommonTracks object
            video.duration = convertDurationToSeconds(query.contentDetails.duration);
        }
    }

    return items;
}

function convertDurationToSeconds(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) {
        return 0;
    }
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}


// export const mapProfileToCommonProfile = (profile: (Document<unknown, any, IProfile> & IProfile & {
//     _id: Types.ObjectId;
// })): CommonProfile => {
//     const provider = profile.provider;


// }