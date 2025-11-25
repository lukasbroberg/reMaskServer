import e from "express";
import supabase from '../supabase.js';
import userController from "../controller/UserController.js";

const router = e.Router();

router.post('/signUp', async (req, res) => {
    await userController.signup(req, res);
})

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email or password is wrong" });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error("subabase login error:", error.message);
            return res.status(400).json({ message: error.message });
        }
        const { user, session } = data;

        if (!session || !session.access_token) {
            console.error("No session returned from supabase");
            return res
                .status(500)
                .json({ message: "No session returned from auth" });
        }

        return res
            .cookie("sb_access_token", session.access_token, {
                httpOnly: true,
                secure: false, // Set to true if using HTTPS
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 // 1 time
            })
            .json({ message: "User logged in successfully" });
    } catch (err) {
        console.error("Unexpected error during login:", err);
        return res.status(500).json({ message: "Internal server error" });
    }

    /*return res.json({
        message: "User logged in successfully",
        user: data.user,
        session: data.session
    });*/
})




export const userRoutes = router;