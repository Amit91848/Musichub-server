import { Router } from 'express';
import spotifyApi from './spotifyApi';
import youtubeApi from './youtubeApi';
import { verifyJWT } from '../../utils/authUtil';
import { getAllPlaylists } from '../../controllers/ApiController';
import { CommonPlaylist } from '../../types/index'
import userRoute from './userApi';
import searchRoute from './searchApi';

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

    try {
        const spotifyPlaylists = await getAllPlaylists(req.user.userId, 'spotify');
        const soundcloudPlaylists = await getAllPlaylists(req.user.userId, 'soundcloud');
        const youtubePlaylists = await getAllPlaylists(req.user.userId, 'youtube');
        playlists = {
            soundcloud: soundcloudPlaylists,
            youtube: youtubePlaylists,
            spotify: spotifyPlaylists
        }
        res.status(200).json({ playlists });
    } catch (err) {
        console.log(err);
    }
})

apiRoute.use('/user', userRoute);

apiRoute.use('/search', searchRoute);

export default apiRoute;