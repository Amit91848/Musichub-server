import { Router } from "express";
import { createCustomPlaylist } from "../../controllers/CustomPlaylist";

const customRoute = Router();

customRoute.get('/create', async (req, res) => {
    const { tracks, name } = req.body;
    const userId = req.user.userId;

    try {
        const create = await createCustomPlaylist(userId, tracks, name);
        return res.status(200).json(create);
    } catch (err) {
        console.log(err);
        return res.status(401).json(err);
    }
})

export default customRoute;