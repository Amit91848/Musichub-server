import CustomPlaylistModel from "../schema/CustomPlaylist"
import { CommonTracks } from "../types";

export const createCustomPlaylist = async (userId: string, name: string, tracks: CommonTracks[]) => {
    const playlist = await CustomPlaylistModel.create({ tracks, name, userId });
    return playlist;
}

export const fetchCustomPlaylist = async (_: string) => {
    return [];
}