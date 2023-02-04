import axios from "axios";
import { youtubePlaylistItemsResponse } from "src/types/youtube";

const youtubeURL = process.env.YOUTUBE_BASE_URL;
const youtubeKey = process.env.YOUTUBE_API_KEY;
export const getYoutubePlaylists = async (accessToken: string, oauthId: string) => {
    let playlistsInfo;

    try {
        const response = await axios.get(`${youtubeURL}/playlists?part=snippet%2CcontentDetails&maxResults=50&mine=true&key=${youtubeKey}&access_token=${accessToken}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        playlistsInfo = await response.data.items;
    } catch (err) {
        console.log(err.data);
    }

    return playlistsInfo;
}

export const getYoutubePlaylistsItems = async (playlistId: string, accessToken: string) => {
    let playlistsItems: youtubePlaylistItemsResponse[];

    try {
        const response = await axios.get(`${youtubeURL}/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistId}&key=${youtubeKey}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        playlistsItems = response.data.items
        return playlistsItems;
    } catch (err) {
        console.log(err.data);
    }
}

export const getYoutubeSearchQuery = async (query: string, accessToken: string) => {
    try {
        const response = await axios.get(`${youtubeURL}/search?part=snippet&maxResults=20&q=${query}&key=${youtubeKey}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (err) {
        return err;
    }
}