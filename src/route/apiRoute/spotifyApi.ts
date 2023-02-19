import { Router } from "express";
import { getSpotifySearchQuery, getSpotifyPlaylists, getSpotifyTracks, getSpotifyArtist, getSpotifyArtistTopTracks } from "../../controllers/ApiController/spotify";
import { mapSpotifySearchTracksToCommonTracks, mapSpotifyTracksToCommonTracks } from "../../utils/map";
import { findProfileOfUser } from "../../controllers/ProfileController";
import { createAxiosIntance } from "../../utils/axios";
import { SpotifyArtists, SpotifyTracksCommon, SpotifyTracksShort } from "../../types/spotify";
import { checkAndRefreshAccessToken, lastFmArtistData, lastFmArtistInfo } from "../../utils/services";

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
    // console.log(req.user);
    // console.log(req.signedCookies);
    // @ts-expect-error
    const playlists = await getSpotifyPlaylists(req.user.userId);
    // res.json({ playlists });
    res.send('working on it');
})

spotifyApi.get('/playlist/:id/tracks', async (req, res) => {
    const playlistId = req.params.id;
    // @ts-expect-error
    const tracks = await getSpotifyTracks(req.user.userId, playlistId);
    const mappedTracks = mapSpotifyTracksToCommonTracks(tracks);
    res.status(200).json({ mappedTracks });
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

    const artists: SpotifyArtists = await getSpotifySearchQuery(req.user.userId, query, 'artists')
    res.json(artists);
})

spotifyApi.get('/search/track/:query', async (req, res) => {
    const query = req.params.query;

    let tracks: SpotifyTracksCommon = await getSpotifySearchQuery(req.user.userId, query, 'tracks')
    const mappedTracks = mapSpotifySearchTracksToCommonTracks(tracks.items)
    // let mappedCommonTracks = { ...tracks, items: mappedTracks };
    res.json(mappedTracks);
})

spotifyApi.get('/artist/:artistId/:artistName', async (req, res) => {
    const { artistId, artistName } = req.params;
    const userId = req.user.userId;

    const [artistTopTracks, artistOtherTracks, artistInfo] = await Promise.all([getSpotifyArtistTopTracks(userId, artistId), getSpotifySearchQuery(userId, artistName, 'tracks'), lastFmArtistData(artistName)]);
    const mappedTopTracks = mapSpotifySearchTracksToCommonTracks(artistTopTracks.tracks);
    const mappedOtherTracks = mapSpotifySearchTracksToCommonTracks(artistOtherTracks.items);

    res.json({ topTracks: mappedTopTracks, otherTracks: mappedOtherTracks, artistInfo: artistInfo });
})

spotifyApi.get('/artist/:artistId/topTracks', async (req, res) => {
    const artistId = req.params.artistId;

    const artistTracks = await getSpotifyArtistTopTracks(req.user.userId, artistId);
    res.json(artistTracks);
});


export default spotifyApi;