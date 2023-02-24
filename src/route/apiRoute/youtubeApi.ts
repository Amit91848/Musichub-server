import { Router } from "express";
import { getYoutubePlaylistsItems, getYoutubeSearchQuery } from '../../controllers/ApiController/youtube'
import { mapYoutubePlaylistItemsToCommonTracks, mapYoutubeQueryResultToCommonTracks } from "../../utils/map";

const youtubeApi = Router();

youtubeApi.get('/playlist/:playlistId/tracks', async (req, res) => {
    const playlistId = req.params.playlistId;
    const userId = req.user.userId;

    const playlistItems = await getYoutubePlaylistsItems(playlistId, userId);
    const mappedTracks = mapYoutubePlaylistItemsToCommonTracks(playlistItems);

    res.status(200).json(mappedTracks);
})

youtubeApi.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    const userId = req.user.userId;

    const queryResults = await getYoutubeSearchQuery(query, userId);
    const mappedQuery = mapYoutubeQueryResultToCommonTracks(queryResults.items);
    res.status(200).json(mappedQuery);
})

youtubeApi.get('/', (_, res) => {
    res.send('Get data from youtube');
})

export default youtubeApi;