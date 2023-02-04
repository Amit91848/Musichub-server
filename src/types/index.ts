export type service = 'youtube' | 'spotify' | 'soundcloud'

export interface CommonPlaylist {
    playlistId: string,
    description: string,
    img: {},
    name: string,
    tracks: [],
    isStarred: false,
    isConnected: true,
    total: number,
    source: service
}

export interface CommonTracks {
    album: {
        id: string,
        title: string
    },
    artist: {
        id: string,
        name: string,
    }[],
    duration: number,
    img: {
        height: number | null,
        url: string,
        width: number | null
    }[],
    source: service,
    title: string,
    id: string
}

export interface CommonProfile {
    [x: string]: {
        image: string | null,
        isConnected: boolean,
        profileUrl: string | null,
        id: string | null,
        username: string | null
    }
}