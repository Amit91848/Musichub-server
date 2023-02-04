import { createAxiosIntance } from "../../utils/axios";
import { findProfileOfUser } from "../ProfileController";
import { checkAndRefreshAccessToken } from "../../utils/services";

export const spotifyURL = process.env.SPOTIFY_BASE_URL;
export type type = 'artists' | 'tracks';

export const getSpotifyPlaylists = async (accessToken: string, oauthId: string) => {

    const playlistInstance = createAxiosIntance({ accessToken, baseURL: spotifyURL });
    let playlists;
    try {
        const response = await playlistInstance.get(`/users/${oauthId}/playlists`);
        playlists = response.data.items;
    } catch (err) {
        console.log(err.response.data);
    }
    return playlists;
}

// curl -X "GET" "https://api.spotify.com/v1/me/playlists" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQAdiX6BkMF4_dBcLFoYc0sRy4DzA5ih3j01kt3CH4hPxjSjEvFpBCmVpr1iMvyUK3NgnyBB9GAWnxdWLbXVyKsf5UwyJBrlRuWPwrmoO6zmuR2c64m5eEWDIunrOXDSXFZqPvcBRVtLTnDyIIeLx0typvJJBwMIDIDMTa144QnPfnISqUGNUSNyQeFB7O6-gN1QAhbPTdIvtxQPxGfnmmUpMNq_AjS-aEYAVo0swk8hf8SuYTflOQvUfJPaMqbD-ifPbswyzScvvAEndCysRADrS-JUjNASCqUttY5jsbu49M16QFlnC7wnH1HyO2Lu_Rrp6kSuQfActw"

export const getSpotifyTracks = async (userId: string, playlistId: string) => {
    const profile = await findProfileOfUser(userId, 'spotify');
    const { expiresIn, refreshToken, _id } = profile;
    let { accessToken } = profile

    let newAccessToken = await checkAndRefreshAccessToken(expiresIn, _id, refreshToken, 'spotify');

    if (newAccessToken) {
        console.log('new acccess token =', accessToken);
        accessToken = newAccessToken;
    }

    const tracksInstance = createAxiosIntance({ accessToken, baseURL: spotifyURL });

    try {
        const response = await tracksInstance.get(`/playlists/${playlistId}/tracks`)
        return response.data.items;
    } catch (err) {
        console.log(err.response.data)
    }
}

export const getSpotifySearchQuery = async (userId: string, query: string, type: type) => {
    const profile = await findProfileOfUser(userId, 'spotify');
    const { expiresIn, refreshToken, _id } = profile;
    let { accessToken } = profile

    let newAccessToken = await checkAndRefreshAccessToken(expiresIn, _id, refreshToken, 'spotify');

    if (newAccessToken) {
        // console.log('new acccess token =', accessToken);
        accessToken = newAccessToken;
    }

    const artistQueryInstance = createAxiosIntance({ accessToken, baseURL: spotifyURL });

    try {
        const response = await artistQueryInstance.get(`/search?type=${type.substring(0, type.length - 1)}&include_external=audio&q=${query}`)
        return response.data[type]
    } catch (err) {
        console.log(err.response.data)
    }
}