import UserModel from "../model/UserModel";

const userController = {
    signup: async (req, res) => {
        const { email, password, name, age, studie } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const userModel = new UserModel()

        try{
            //const checkUserExists_request = await userModel.
            const signup_request = await userModel.insertNewUser()
            console.log(signup_request);
        }catch(error){
            console.error("supabase signUp error:", error.message);
            return res
                .status(400)
                .json({ message: error.message });
        }

    
        return res.status(201).json({
            message: "User signed up successfully",
            user: data.user
        });
    }
}

export default userController;