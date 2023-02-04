export interface youtubePlaylistResponse {
    kind: string,
    etag: string,
    id: string,
    snippet: {
        publicshedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: {
            url: string,
            height: number | null,
            width: number | null
        }[],
        channelTitle: string,
        localized: {
            title: string,
            description: string
        }
    },
    contentDetails: {
        itemCount: number
    }
}

export interface youtubePlaylistItemsResponse {
    kind: string,
    etag: string,
    id: string,
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: {
            url: string,
            height: number | null,
            width: number | null
        }[],
        channelTitle: string,
        playlistId: string,
        position: number
        resourceId: {
            kind: string,
            videoId: string
        },
        videoOwnerChannelTitle: string,
        videoOwnerChannelId: string,
    },
    contentDetails: {
        videoId: string,
        videoPublishedAt: string
    }
}

export interface youtubeSearchQuery {
    kind: string,
    etag: string,
    id: {
        kind: string,
        videoId: string
    },
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: {
            url: string,
            height: number | null,
            width: number | null
        }[],
        channelTitle: string,
        liveBroadcastContent: string,
        publishedTime: string
    }
}