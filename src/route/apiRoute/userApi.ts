import { Router } from 'express'
import { fetchUserData } from '../../controllers/ApiController/User';
import { mapProfileToCommonProfile } from '../../utils/map';

const userRoute = Router();

userRoute.get('/', async (req, res) => {
    const userId = req.user.userId;
    const profiles = await fetchUserData(userId);
    res.json(profiles);
})

export default userRoute;