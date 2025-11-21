import e from "express";
import supabase from '../supabase.js';

const router = e.Router();

router.post('/signUp', async (req, res) => {
    const { email, password, name, age, studie } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
                age: age,
                studie: studie
            }
        }
    })
    if (error) {
        console.error("supabase signUp error:", error.message);
        return res
            .status(400)
            .json({ message: error.message });
    }

    return res.status(201).json({
        message: "User signed up successfully",
        user: data.user
    });
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email or password is wrong" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })


    if (error) {
        console.error("subabase login error:", error.message);
        return res.status(400).json({ message: error.message });
    }

    return res.json({
        message: "User logged in successfully",
        user: data.user,
        session: data.session
    });
})




export const userRoutes = router;