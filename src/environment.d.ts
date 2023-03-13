declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number;
            SPOTIFY_CLIENT_ID: !string,
            SPOTIFY_CLIENT_SECRET: !string,
            GOOGLE_CLIENT_ID: !string,
            GOOGLE_CLIENT_SECRET: !string,
            DATABASE: !string,
            PG_PASSWORD: !string,
            PG_USER: !string,
            PG_PORT: !number,
            MONGO_URI: !string,
            JWT_SECRET: !string,
            JWT_EXPIRES_IN: !string,
            SESSION_SECRET: !string,
            SUCCESS_REDIRECT: !string,
            FAILED_REDIRECT: !string,
            SPOTIFY_BASE_URL: !string,
            YOUTUBE_BASE_URL: !string,
            YOUTUBE_API_KEY: !string,
            FRONTEND_URL: !string
        }
    }
}

import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
declare module "express-session" {
    interface SessionData {
        passport: {
            user: {
                userId: Types.ObjectId
            }
        }
    }
}

import { Request } from "express";
declare module Express {
    interface Request {
        user: {
            userId: string
        }
    }
}

export { }
