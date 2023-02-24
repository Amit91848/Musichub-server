import { Router } from "express";
import { getYoutubePlaylistsItems, getYoutubeSearchQuery } from '../../controllers/ApiController/youtube'
import { mapYoutubePlaylistItemsToCommonTracks, mapYoutubeQueryResultToCommonTracks } from "../../utils/map";
import redisClient from "../../config/redisSetup";

const youtubeApi = Router();

youtubeApi.get('/playlist/:playlistId/tracks', async (req, res) => {
    const playlistId = req.params.playlistId;
    const userId = req.user.userId;

    const cachedPlaylist = await redisClient.get(`youtube:playlist:${playlistId}`);

    if (cachedPlaylist) {
        return res.status(200).json(JSON.parse(cachedPlaylist));
    } else {
        const playlistItems = await getYoutubePlaylistsItems(playlistId, userId);
        const mappedTracks = mapYoutubePlaylistItemsToCommonTracks(playlistItems);

        await redisClient.set(`youtube:playlist:${playlistId}`, JSON.stringify(mappedTracks));

        return res.status(200).json(mappedTracks);
    }
})

youtubeApi.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    const userId = req.user.userId;

    const cachedQuery = await redisClient.get(`youtube:search:${query}`);

    if (cachedQuery) {
        return res.status(200).json(JSON.parse(cachedQuery));
    } else {
        const queryResults = await getYoutubeSearchQuery(query, userId);
        const mappedQuery = mapYoutubeQueryResultToCommonTracks(queryResults.items);
        await redisClient.set(`youtube:search:${query}`, JSON.stringify(mappedQuery));
        return res.status(200).json(mappedQuery);
    }
})

youtubeApi.get('/', (_, res) => {
    res.send('Get data from youtube');
})

export default youtubeApi;