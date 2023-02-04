import mongoose, { Schema, Types } from 'mongoose';

export interface IProfile {
    refreshToken: string,
    userId: Types.ObjectId,
    provider: string,
    expiresIn: number,
    accessToken: string,
    name: string,
    picture: string,
    oauthId: string
}

const ProfileSchema: Schema = new Schema({
    accessToken: {
        type: String,
        required: true
    },
    expiresIn: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
    },
    refreshToken: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    oauthId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

// ProfileSchema.pre('save', async function (next) {
//     if(this.isModified('accessToken')) {
//         this.accessToken = await argon2i. 
//     }
//     if(this.isModified('refreshTOken')) {
//         this.refreshToken = await argon2.hash(this.refreshToken);
//     }
//     next();
// })

// ProfileSchema.post(['update', 'findOneAndUpdate', 'updateOne'], async (docs) => {
//     for(const doc of docs) {
//         doc.accessToken = await argon2.

//     }
// })

const ProfileModel = mongoose.model<IProfile>('Profile', ProfileSchema);


export default ProfileModel;