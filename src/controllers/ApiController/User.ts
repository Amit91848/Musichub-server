import { findAllProfiles } from "../ProfileController";

export const fetchUserData = async (userId: string) => {
    const profiles = await findAllProfiles(userId);

    console.log(userId);

    const providers = {
        spotify: {
            image: '',
            isConnected: false,
            profileUrl: '',
            id: '',
            username: ''
        },
        youtube: {
            image: '',
            isConnected: false,
            profileUrl: '',
            id: '',
            username: ''
        },
        soundcloud: {
            image: '',
            isConnected: false,
            profileUrl: '',
            id: '',
            username: ''
        }
    };

    for (const profile of profiles) {
        const provider = profile.provider === 'google' ? 'youtube' : profile.provider;
        const info = providers[provider];
        if (info) {
            info.isConnected = true;
            info.image = profile.picture;
            if (provider === 'youtube') {
                info.profileUrl = `https://plus.google.com/${profile.oauthId}`;
                info.id = profile.oauthId;
                info.username = profile.name;
            } else if (provider === 'spotify') {
                info.profileUrl = `https://open.spotify.com/user/${profile.oauthId}`;
                info.id = profile.oauthId;
                info.username = profile.name;
            } else if (provider === 'soundcloud') {
                info.profileUrl = profile.oauthId;
                info.id = profile.oauthId;
                info.username = profile.name;
            }
        }
    }

    return providers;
}
