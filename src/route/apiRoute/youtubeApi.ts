import { Router } from "express";
import { getYoutubePlaylistsItems, getYoutubeSearchQuery } from '../../controllers/ApiController/youtube'
import { findProfileOfUser } from "../../controllers/ProfileController";
import { checkAndRefreshAccessToken } from "../../utils/services";
import { mapYoutubePlaylistItemsToCommonTracks, mapYoutubeQueryResultToCommonTracks } from "../../utils/map";

const youtubeApi = Router();

youtubeApi.get('/playlist/:playlistId/tracks', async (req, res) => {
    const playlistId = req.params.playlistId;
    const profile = await findProfileOfUser(req.user.userId, 'youtube');
    if (profile) {
        const { expiresIn, refreshToken, _id } = profile;
        let { accessToken } = profile

        let newAccessToken = await checkAndRefreshAccessToken(expiresIn, _id, refreshToken, 'youtube');

        if (newAccessToken) {
            console.log('new access token for youtube: ', newAccessToken);
            accessToken = newAccessToken;
        }

        const playlistItems = await getYoutubePlaylistsItems(playlistId, accessToken);
        const mappedTracks = mapYoutubePlaylistItemsToCommonTracks(playlistItems);
        res.json({ mappedTracks });
    }
})

youtubeApi.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    const profile = await findProfileOfUser(req.user.userId, 'youtube');
    if (profile) {
        const { expiresIn, refreshToken, _id } = profile;
        let { accessToken } = profile

        let newAccessToken = await checkAndRefreshAccessToken(expiresIn, _id, refreshToken, 'youtube');

        if (newAccessToken) {
            accessToken = newAccessToken;
        }
        const queryResults = await getYoutubeSearchQuery(query, accessToken);
        const mappedQuery = mapYoutubeQueryResultToCommonTracks(queryResults.items);
        res.json(mappedQuery);
    }
})

youtubeApi.get('/', (_, res) => {
    res.send('Get data from youtube');
})

export default youtubeApi;