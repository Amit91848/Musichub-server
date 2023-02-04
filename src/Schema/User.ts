import mongoose, { Schema, Document, SchemaTypes } from 'mongoose';

export interface IUser extends Document {
    spotifyProfileId: string,
    googleProfileId: string
}

export const UserSchema: Schema = new Schema({
    spotifyProfileId: {
        type: SchemaTypes.ObjectId,
    },
    googleProfileId: {
        type: SchemaTypes.ObjectId
    }
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export const deleteAllUsers = async () => {
    await UserModel.deleteMany({});
}

export default UserModel;
