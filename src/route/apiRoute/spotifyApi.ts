import { Router } from "express";
import { getSpotifySearchQuery, getSpotifyPlaylists, getSpotifyTracks, getSpotifyArtistTopTracks } from "../../controllers/ApiController/spotify";
import { mapSpotifySearchTracksToCommonTracks, mapSpotifyTracksToCommonTracks } from "../../utils/map";
import { findProfileOfUser } from "../../controllers/ProfileController";
import { createAxiosIntance } from "../../utils/axios";
import { SpotifyArtists, SpotifyTracksCommon } from "../../types/spotify";
import { checkAndRefreshAccessToken, lastFmArtistData } from "../../utils/services";
import { findInCache, setExCache } from "../../utils/redis";

interface SpotifyDevices {
    id: string,
    is_active: boolean,
    is_private_session: boolean,
    is_restricted: boolean,
    name: string,
    type: string,
    volume_percent: number
}

const spotifyApi = Router();

spotifyApi.get('/playlists', async (req, res) => {
    // @ts-expect-error
    const playlists = await getSpotifyPlaylists(req.user.userId);
    // res.json({ playlists });
    res.send('working on it');
})

spotifyApi.get('/playlist/:id/tracks', async (req, res) => {
    const playlistId = req.params.id;
    const cachedTracks = await findInCache(`spotify:playlist:${playlistId}`);
    if (cachedTracks) {
        return res.status(200).json(JSON.parse(cachedTracks));
    } else {
        const tracks = await getSpotifyTracks(req.user.userId, playlistId);
        const mappedTracks = mapSpotifyTracksToCommonTracks(tracks);
        await setExCache(`spotify:playlist:${playlistId}`, JSON.stringify(mappedTracks));
        return res.status(200).json(mappedTracks);
    }
})

spotifyApi.get('/access_token', async (req, res) => {
    const userId = req.user.userId;
    const profile = await findProfileOfUser(userId, 'spotify');
    if (profile) {
        let accessToken = profile.accessToken
        let newAccessToken = await checkAndRefreshAccessToken(profile.expiresIn, profile._id, profile.refreshToken, 'spotify');
        if (newAccessToken) {
            accessToken = newAccessToken;
        }
        res.status(200).json(accessToken);
    }
})

spotifyApi.get('/deviceId', async (req, res) => {
    const userId = req.user.userId;

    const profile = await findProfileOfUser(userId, 'spotify');

    const deviceInstance = createAxiosIntance({ accessToken: profile?.accessToken, baseURL: process.env.SPOTIFY_BASE_URL });

    const deviceId = await deviceInstance.get('/me/player/devices');
    const devices: SpotifyDevices[] = deviceId.data.devices;

    const device = devices.find(device => device.name === 'Music Hub');

    res.json(device?.id);
})

spotifyApi.get('/search/artist/:query', async (req, res) => {
    const query = req.params.query;

    const cachedArtist = await findInCache(`spotify:artistsQuery:${query}`);

    if (cachedArtist) {
        return res.status(200).json(JSON.parse(cachedArtist));
    } else {
        const artists: SpotifyArtists = await getSpotifySearchQuery(req.user.userId, query, 'artists')
        await setExCache(`spotify:artistsQuery:${query}`, JSON.stringify(artists));
        return res.status(200).json(artists);
    }
})

spotifyApi.get('/search/track/:query', async (req, res) => {
    const query = req.params.query;

    const cachedTracks = await findInCache(`spotify:tracksQuery:${query}`);
    if (cachedTracks) {
        return res.status(200).json(JSON.parse(cachedTracks));
    } else {
        let tracks: SpotifyTracksCommon = await getSpotifySearchQuery(req.user.userId, query, 'tracks')
        const mappedTracks = mapSpotifySearchTracksToCommonTracks(tracks.items)
        await setExCache(`spotify:tracksQuery:${query}`, JSON.stringify(mappedTracks));
        return res.status(200).json(mappedTracks);
    }
})

spotifyApi.get('/artist/:artistId/:artistName', async (req, res) => {
    const { artistId, artistName } = req.params;
    const userId = req.user.userId;

    const cachedArtist = await findInCache(`spotify:artist:${artistId}`);

    if (cachedArtist) {
        return res.status(200).json(JSON.parse(cachedArtist));
    } else {
        const [artistTopTracks, artistOtherTracks, artistInfo] = await Promise.all([getSpotifyArtistTopTracks(userId, artistId), getSpotifySearchQuery(userId, artistName, 'tracks'), lastFmArtistData(artistName)]);
        const mappedTopTracks = mapSpotifySearchTracksToCommonTracks(artistTopTracks.tracks);
        const mappedOtherTracks = mapSpotifySearchTracksToCommonTracks(artistOtherTracks.items);

        const response = { topTracks: mappedTopTracks, otherTracks: mappedOtherTracks, artistInfo: artistInfo }
        await setExCache(`spotify:artist:${artistId}`, JSON.stringify(response));
        return res.status(200).json(response);
    }
})

spotifyApi.get('/artist/:artistId/topTracks', async (req, res) => {
    const artistId = req.params.artistId;

    const cachedTopTracks = await findInCache(`spotify:topTracks:${artistId}`);

    if (cachedTopTracks) {
        return res.status(200).json(JSON.parse(cachedTopTracks));
    } else {
        const artistTracks = await getSpotifyArtistTopTracks(req.user.userId, artistId);
        await setExCache(`spotify:topTracks:${artistId}`, artistTracks);
        return res.json(artistTracks);
    }

});


export default spotifyApi;