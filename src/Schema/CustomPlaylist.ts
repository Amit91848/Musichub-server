import mongoose, { Schema } from "mongoose";
import { CommonTracks } from "../types";

export interface ICustomPlaylist {
    name: string
    userId: mongoose.Types.ObjectId
    tracks: CommonTracks[]
}

const CustomPlaylistSchema: Schema = new Schema({
    name: String,
    userId: mongoose.Types.ObjectId,
    tracks: [{
        album: {
            id: String,
            title: String
        },
        artist: [{
            external_urls: {
                spotify: String
            },
            href: String,
            id: String,
            name: String,
            type: String,
            uri: String
        }],
        duration: Number,
        title: String,
        img: [{
            height: Number,
            url: String,
            width: Number
        }],
        source: String,
        id: String
    }]
})

const CustomPlaylistModel = mongoose.model<ICustomPlaylist>('Custom Playlist', CustomPlaylistSchema);

export default CustomPlaylistModel;