import passport from "passport"
import { googleAuth, googleLink, spotifyAuth, spotifyLink } from "../config/passportSetup"

let googleScope = ['email', 'profile', 'openid', 'https://www.googleapis.com/auth/youtube']
let spotifyScope = ["user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "streaming",
    "user-modify-playback-state",
    "playlist-modify-public",
    "user-library-modify",
    "user-top-read",
    "playlist-read-collaborative",
    "app-remote-control",
    "user-read-currently-playing",
    "playlist-read-private",
    "user-follow-read",
    "user-read-recently-played",
    "playlist-modify-private",
    "user-library-read"]

export const authenticateWithOAuth = (type: string, linking?: boolean) => {
    if (type === 'google') {
        if (linking) {
            return passport.authenticate(googleLink, { scope: googleScope, prompt: 'consent', accessType: 'offline' } as any);
        } else {
            return passport.authenticate(googleAuth, { scope: googleScope, prompt: 'consent', accessType: 'offline' } as any);
        }

    } else {
        if (linking) {
            return passport.authenticate(spotifyLink, { scope: spotifyScope, showDialog: true } as any);
        } else {
            return passport.authenticate(spotifyAuth, { scope: spotifyScope, showDialog: true } as any);
        }
    }

}
export const authenticateOAuthCallback = (type: string, linking?: boolean) => {
    if (type === 'google') {
        if (linking) {
            return passport.authenticate(googleLink, { failureRedirect: '/auth/failed', successRedirect: '/auth/linksuccess' })
        }
        else {
            return passport.authenticate(googleAuth, { failureRedirect: process.env.FAILED_REDIRECT, successRedirect: 'http://localhost:4040/auth/success' })
        };

    } else {
        if (linking) {
            return passport.authenticate(spotifyLink, { failureRedirect: '/auth/failed', successRedirect: '/auth/linksuccess' })
        }
        else {
            return passport.authenticate(spotifyAuth, { failureRedirect: process.env.FAILED_REDIRECT, successRedirect: 'http://localhost:4040/auth/success' })
        };
    }

}

// export const authenticateWithOAuth = (type: string, linking?: boolean) => {
//     if (type === 'google') {
//         return passport.authenticate(googleAuth, { scope: googleScope, prompt: 'consent', accessType: 'offline' } as any);
//     } else {
//         return passport.authenticate(spotifyAuth, { scope: spotifyScope, showDialog: true } as any);
//     }
// }



// export const authenticateOAuthCallback = (type: string, linking?: boolean) => {
//     if (type === 'google') {
//         return passport.authenticate(googleAuth, { failureRedirect: '/auth/failed', successRedirect: '/auth/success' })
//     } else {
//         return passport.authenticate(spotifyAuth, { failureRedirect: '/auth/failed', successRedirect: '/auth/success' });
//     }
// }