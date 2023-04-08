import { Request, Router } from 'express'
import { fetchUserData } from '../../controllers/ApiController/User';
import { service } from '../../types';
import { deleteProfile } from '../../controllers/ProfileController';
import { unsetProvider } from '../../controllers/UserController';

const userRoute = Router();

interface source {
    provider: service
}

userRoute.get('/', async (req, res) => {
    // @ts-ignore
    const userId = req.user.userId;
    const profiles = await fetchUserData(userId);
    res.json(profiles);
})

userRoute.get('/remove', async (req: Request<unknown, unknown, unknown, source>, res) => {
    // @ts-ignore
    const userId = req.user!.userId;
    const { provider } = req.query;

    try {
        // delete profile collection
        const d = await deleteProfile(userId, provider);
        // delete profile field from user collection
        await unsetProvider(userId, provider);
        return res.json({ message: `deleted profile: ${d}` })
    } catch (err) {
        return res.json({ message: 'unable to delete try again later' })
    }
})

export default userRoute;