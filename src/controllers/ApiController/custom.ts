import { fetchCustomPlaylist } from "../CustomPlaylist";

export const getCustomPlaylists = async (userId: string) => {
    return fetchCustomPlaylist(userId);
}