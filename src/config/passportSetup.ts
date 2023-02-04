import { Strategy as SpotifyStrategy } from "passport-spotify";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import refresh from 'passport-oauth2-refresh';
import 'dotenv/config';
import { LinkAccount, SignUpOrSignIn } from "../controllers/UserController";

passport.serializeUser(function (data, done) {
    done(null, data);
});

passport.deserializeUser(async function (user, done) {
    done(null, user as any);
})

export const googleAuth = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        SignUpOrSignIn({ profile, accessToken, refreshToken, done });
    }
)

export const googleLink = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/link/callback',
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
        LinkAccount({ req, accessToken, refreshToken, profile, done })
    }
)

export const spotifyAuth = new SpotifyStrategy(
    {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: '/auth/spotify/callback'
    },
    (accessToken, refreshToken, _, profile, done) => {
        SignUpOrSignIn({ profile, accessToken, refreshToken, done });
    }
);

export const spotifyLink = new SpotifyStrategy(
    {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: '/auth/spotify/link/callback',
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, _, profile, done) => {
        LinkAccount({ req, profile, accessToken, refreshToken, done });
    }
);

refresh.use(googleAuth);
refresh.use(spotifyAuth as any);

passport.use('googleLink', googleLink);
passport.use('spotifyLink', spotifyLink);
passport.use('spotify', spotifyAuth);
passport.use('google', googleAuth);