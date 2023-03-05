import { Router } from "express";
import { getYoutubePlaylistsItems, getYoutubeSearchQuery } from '../../controllers/ApiController/youtube'
import { mapYoutubePlaylistItemsToCommonTracks, mapYoutubeQueryResultToCommonTracks, mapYoutubeVideoDurationToPlaylistItems } from "../../utils/map";
import { findInCache, setExCache } from "../../utils/redis";

const youtubeApi = Router();

youtubeApi.get('/playlist/:playlistId/tracks', async (req, res) => {
    const playlistId = req.params.playlistId;
    const userId = req.user.userId;
    const sync = req.query.sync

    const cachedPlaylist = await findInCache(`youtube:playlist:${playlistId}`);

    if (cachedPlaylist && !sync) {
        return res.status(200).json(JSON.parse(cachedPlaylist));
    } else {
        const playlistItems = await getYoutubePlaylistsItems(playlistId, userId);
        let mappedTracks = mapYoutubePlaylistItemsToCommonTracks(playlistItems);
        mappedTracks = await mapYoutubeVideoDurationToPlaylistItems(mappedTracks, userId);

        await setExCache(`youtube:playlist:${playlistId}`, JSON.stringify(mappedTracks));

        return res.status(200).json(mappedTracks);
    }
})

youtubeApi.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    const userId = req.user.userId;

    const cachedQuery = await findInCache(`youtube:search:${query}`);

    if (cachedQuery) {
        return res.status(200).json(JSON.parse(cachedQuery));
    } else {
        const queryResults = await getYoutubeSearchQuery(query, userId);
        const mappedQuery = mapYoutubeQueryResultToCommonTracks(queryResults.items);
        await setExCache(`youtube:search:${query}`, JSON.stringify(mappedQuery));
        return res.status(200).json(mappedQuery);
    }
})

youtubeApi.get('/', (_, res) => {
    res.send('Get data from youtube');
})

export default youtubeApi;