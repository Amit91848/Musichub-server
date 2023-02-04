import request from 'request';
import { updateProfile } from '../controllers/ProfileController';
import util from 'util';
import { Types } from 'mongoose';
import { service } from '../types/index';
import axios from 'axios';

const post = util.promisify(request.post);

export const checkAndRefreshAccessToken = async (expiresIn: number, _id: Types.ObjectId, refreshToken: string, service: service) => {
    if (Date.now() > expiresIn) {
        return await refreshAccessToken(refreshToken, _id, service);
    }
    return undefined;
}

export const refreshAccessToken = async (refreshToken: string, profile_id: Types.ObjectId, service: service) => {
    let accessToken;
    if (service === 'spotify') {
        const spotifyURL = 'https://accounts.spotify.com/api/token';

        let authOptions = {
            url: spotifyURL,
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)).toString('base64')
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            json: true
        };

        const { statusCode, body } = await post(authOptions);
        if (statusCode === 200) {
            accessToken = body.access_token;
        }
    } else if (service === 'youtube') {
        const youtubeURL = 'https://oauth2.googleapis.com/token';
        const formData = new URLSearchParams();
        formData.append('grant_type', 'refresh_token');
        formData.append('client_id', process.env.GOOGLE_CLIENT_ID);
        formData.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
        formData.append('refresh_token', refreshToken);
        try {
            const response = await axios.post(youtubeURL, formData);
            accessToken = response.data.access_token;
        } catch (err) {
            console.log(err);
        }
    }
    await updateProfile({ profile_id, accessToken });
    return accessToken;
}