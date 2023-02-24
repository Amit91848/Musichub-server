import { VerifyCallback } from "passport-spotify"
import UserModel from "../schema/User"
import { createProfile, doesProfileExist, updateProfile } from "./ProfileController";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { Types } from "mongoose";

export interface Profile {
    id: string,
    displayName: string,
    _json: {
        email?: string,
        picture: string,
        images: {
            url: string
        }[]
    },
    provider: string
}

export interface CookieDataFormat {
    userId: Types.ObjectId
    iat: Date,
    exp: Date
}

export interface OAuthResponse {
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback;
}

export interface OAuthResponseWithReq {
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback;
}

export const logoutUser = async (res: Response) => {
    res.clearCookie('appUser');
}

export const findUser = async (userId: string) => {
    console.log('userid in finduser function: ', userId);
    return await UserModel.findOne({ _id: userId });
}

export const createUser = async () => {
    const user = await UserModel.create({});
    await user.save()

    return user;
}

export const SignUpOrSignIn = async ({ accessToken, refreshToken, profile, done }: OAuthResponse) => {
    // Check if token exists
    // console.log(profile);
    let serviceProfile = await doesProfileExist(profile.id);

    if (!serviceProfile) {
        // Create user
        let user = await createUser();

        // create profile linked to user
        let picture = '';
        if (profile.provider === 'spotify') {
            if (profile._json.images.length !== 0) picture = profile._json.images[0].url
        } else if (profile.provider === 'google') picture = profile._json.picture

        let newProfile = await createProfile({ accessToken, refreshToken, oauthId: profile.id, provider: profile.provider, userId: user._id, name: profile.displayName, picture });
        serviceProfile = newProfile;

        // link user to profile
        await UserModel.updateOne({ _id: user._id }, { $set: { [profile.provider + 'ProfileId']: newProfile._id } });

    } else {
        // Update profile data
        await updateProfile({ profile_id: serviceProfile._id, refreshToken, accessToken });
    }

    done(null, { userId: serviceProfile?.userId });
}

export const LinkAccount = async ({ req, accessToken, refreshToken, profile, done }: OAuthResponseWithReq) => {
    const cookie = req.cookies.appUser;
    const cookieData: CookieDataFormat = verify(cookie, process.env.JWT_SECRET) as unknown as CookieDataFormat;
    // get userId from cookie
    const userId = cookieData.userId;

    // Check if profileExists
    let serviceProfile = await doesProfileExist(profile.id);

    let picture = '';
    if (profile.provider === 'spotify') {
        if (profile._json.images.length !== 0) picture = profile._json.images[0].url
    } else if (profile.provider === 'google') picture = profile._json.picture

    if (!serviceProfile) {
        // Create profile if signing in for the first time
        serviceProfile = await createProfile({ accessToken, refreshToken, oauthId: profile.id, provider: profile.provider, userId, picture, name: profile.displayName });
    }

    // link user to service profile
    await UserModel.findOneAndUpdate({ _id: userId }, { $set: { [profile.provider + 'ProfileId']: serviceProfile._id } });

    done(null, cookieData.userId);
}