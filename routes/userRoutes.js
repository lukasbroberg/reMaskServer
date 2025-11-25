import e from "express";
import supabase from '../supabase.js';
import userController from "../controller/UserController.js";

const router = e.Router();

router.post('/signUp', async (req, res) => {
    await userController.signup(req, res);
})

router.post('/login', async (req, res) => {
    await userController.login(req, res);
})

router.get('/', async(req, res) => {
    await userController.getCurrentUser(req, res);
})




export const userRoutes = router;