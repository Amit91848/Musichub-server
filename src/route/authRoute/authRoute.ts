import { Router } from "express";
import { authenticateOAuthCallback, authenticateWithOAuth } from "../../controllers/AuthController";
import { createJWT } from "../../utils/authUtil";
import { logoutUser } from "../../controllers/UserController";

const authRoute = Router();

const linking = true

// Normal signin / signup
authRoute.get('/google', authenticateWithOAuth('google', !linking));
authRoute.get('/google/callback', authenticateOAuthCallback('google', !linking));

authRoute.get('/spotify', authenticateWithOAuth('spotify', !linking));
authRoute.get('/spotify/callback', authenticateOAuthCallback('spotify', !linking));

authRoute.get('/success', (req, res) => {
    // console.log(req.session.passport.user.userId);
    console.log('at success setting jwt');
    // @ts-expect-error
    const jwt = createJWT(req.session.passport.user.userId as any);
    console.log(jwt);
    res.cookie('appUser', jwt, {
        sameSite: "lax",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        // domain: '.vercel.app',
        // secure: true
    }).redirect(`${process.env.FRONTEND_URL}/library`);
});


authRoute.get('/linksuccess', (_, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/library`)
})

authRoute.get('/failed', (_, res) => {
    res.send('Auth failed');
})

//Linking services
authRoute.get('/google/link', authenticateWithOAuth('google', linking));
authRoute.get('/spotify/link', authenticateWithOAuth('spotify', linking));

authRoute.get('/google/link/callback', authenticateOAuthCallback('google', linking));
authRoute.get('/spotify/link/callback', authenticateOAuthCallback('spotify', linking));

authRoute.get('/logout', (_, res) => {
    logoutUser(res);
    res.json({ success: true, message: 'Logged out successfully' });
})

export default authRoute;