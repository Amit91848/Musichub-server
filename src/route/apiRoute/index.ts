import { Router } from 'express';
import spotifyApi from './spotifyApi';
import youtubeApi from './youtubeApi';
import { verifyJWT } from '../../utils/authUtil';
import { getAllPlaylists } from '../../controllers/ApiController';
import { CommonPlaylist } from '../../types/index'
import userRoute from './userApi';
import searchRoute from './searchApi';
import redisClient from '../../config/redisSetup';

const apiRoute = Router();

export interface playlist {
    spotify: CommonPlaylist[],
    youtube: CommonPlaylist[],
    soundcloud: CommonPlaylist[]
}

apiRoute.use(verifyJWT());

apiRoute.use('/spotify', spotifyApi);

apiRoute.use('/youtube', youtubeApi);

apiRoute.use('/playlists', async (req, res) => {
    let playlists: playlist;
    const userId = req.user.userId;
    const sync = req.query.sync

    const cachedPlaylist = await redisClient.get(`${userId}:all:Playlists`)
    if (cachedPlaylist && !sync) {
        playlists = JSON.parse(cachedPlaylist);
        return res.status(200).json({ playlists });
    } else {
        try {
            const spotifyPlaylists = await getAllPlaylists(userId, 'spotify');
            const soundcloudPlaylists = await getAllPlaylists(userId, 'soundcloud');
            const youtubePlaylists = await getAllPlaylists(userId, 'youtube');
            playlists = {
                soundcloud: soundcloudPlaylists,
                youtube: youtubePlaylists,
                spotify: spotifyPlaylists
            }
            await redisClient.set(`${userId}:all:Playlists`, JSON.stringify(playlists))
            return res.status(200).json({ playlists });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
})

apiRoute.use('/user', userRoute);

apiRoute.use('/search', searchRoute);

export default apiRoute;