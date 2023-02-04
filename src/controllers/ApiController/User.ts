import { mapProfileToCommonProfile } from "../../utils/map";
import { findAllProfiles } from "../ProfileController";

export const fetchUserData = async (userId: string) => {
    const profiles = await findAllProfiles(userId);
    return profiles;
}