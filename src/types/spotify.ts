export interface SpotifyPlaylist {
    collaborative: boolean
    description: string
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: {
        url: string
        height: number | null
        width: number | null
    }[]
    name: string
    owner: {
        display_name: string
        external_urls: {
            spotify: string
        }
        followers: {
            href: string
            total: number | undefined
        }
        href: string
        id: string
        type: 'user'
        uri: string
    }
    public: boolean
    snapshot_id: string
    tracks: {
        href: string
        total: number
    }
}

export interface Artists {
    external_url: {
        spotify: string,
    },
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string
}

export interface SpotifyTracksShort {
    track: {
        album: {
            album_type: string,
            id: string,
            name: string,
            images: {
                height: number,
                width: number,
                url: string
            }[],
            artists: Artists[]
        },
        external_urls: {
            spotify: string,
        },
        href: string,
        id: string,
        name: string,
        uri: string,
        artists: Artists[],
        duration_ms: number,
    }
}


export interface SpotifyTracksCommon extends SpotifyCommon {
    items: {
        album: {
            album_type: string,
            id: string,
            name: string,
            images: {
                height: number,
                width: number,
                url: string
            }[],
            artists: Artists[]
        },
        external_urls: {
            spotify: string,
        },
        href: string,
        id: string,
        name: string,
        uri: string,
        artists: Artists[],
        duration_ms: number,
    }[]
}

export interface SpotifyArtists extends SpotifyCommon {
    items: {
        externals_urls: {
            spotify: string,
        },
        followers: {
            href: null,
            total: number,
        },
        genres: string[],
        href: string,
        id: string,
        images: {
            height: number,
            url: string,
            width: number
        }[],
        name: string,
        popularity: 89,
        type: string,
        uri: string
    }[]
}

export interface SpotifyCommon {
    href: string,
    limit: number,
    next: string,
    offset: 0,
    previous: string | null,
    total: number
}