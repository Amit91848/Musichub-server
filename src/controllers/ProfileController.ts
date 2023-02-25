import { Types } from "mongoose"
import ProfileModel, { IProfile } from "../schema/Profile";
import { service } from "src/types";

interface updateTypes {
    profile_id: Types.ObjectId,
    accessToken?: string,
    refreshToken?: string
}

export const calculateExpirationTime = () => {
    const expirationTime = new Date();
    return expirationTime.setMinutes(expirationTime.getMinutes() + 55);
}

export const doesProfileExist = async (oauthId: string): Promise<(IProfile & { _id: Types.ObjectId; }) | null> => {
    return await ProfileModel.findOne({ oauthId: oauthId });
}

export const createProfile = async ({ accessToken, oauthId, provider, refreshToken, userId, name, picture }: IProfile) => {
    // const nProvider = provider === 'google' ? 'youtube' : provider;
    const expiresIn = new Date(Date.now() + 3600 * 1000);
    const token = new ProfileModel({
        accessToken,
        expiresIn,
        oauthId,
        // nProvider,
        provider,
        refreshToken,
        name,
        picture,
        userId
    });

    await token.save();
    return token as (IProfile & { _id: Types.ObjectId; });
}

export const updateProfile = async ({ profile_id, refreshToken, accessToken }: updateTypes) => {
    let expiresIn = calculateExpirationTime()
    if (refreshToken) {
        await ProfileModel.updateOne({ _id: profile_id }, { $set: { refreshToken, accessToken, expiresIn } });
    } else {
        await ProfileModel.updateOne({ _id: profile_id }, { $set: { accessToken, expiresIn } });
    }
}

export const findProfileOfUser = async (userId: string, source: service) => {
    if (source === 'youtube') source = 'google';
    return await ProfileModel.findOne({ userId: userId, provider: [source] });
}

export const findAllProfiles = async (userId: string) => {
    return await ProfileModel.find({ userId: userId });
}