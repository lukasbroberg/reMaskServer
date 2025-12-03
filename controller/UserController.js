import InventoryModel from "../model/InventoryModel.js";
import UserModel from "../model/UserModel.js";
import supabase from "../supabase.js";

const userController = {
    signup: async (req, res) => {

        if(!req.body){
            return res.status(400).json({ message: "Email and password are required" });
        }

        const { email, password, firstName, lastName, studie } = req.body;

        if(!email || !password ){
            return res.status(400).json({ message: "Email and password are required" });
        }

        var new_user = {};
        const userModel = new UserModel()

        try{
            const signup_request = await userModel.authUserSignUp({email, password})
            const newUserId = await signup_request.user.id;
            new_user = await userModel.insertNewUserOnUserTable({firstName, lastName, studie, UUID: newUserId});
        }catch(error){
            console.error("supabase signUp error:", error);
            return res
                .status(400)
                .json({ message: error.message });
        }

        return res.json({
            message: "User signed up successfully",
            user: new_user
        });
    },

    login: async (req, res) => {

        if(!req.body){
            return res.status(400).json({ message: "Email and password are required" });
        }

        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userModel = new UserModel();
        const inventoryModel = new InventoryModel();
        
        try{
            //Login and create session
            const userLogin_request = await userModel.authUserLogin(email, password)
            const userUUID = userLogin_request.user.id;

            if (!userLogin_request.session || !userLogin_request.session.access_token) {
                console.error("No session returned from supabase");
                return res
                    .status(500)
                    .json({ message: "No session returned from auth" });
            }

            //Get user Id
            const userDataFromTable = await userModel.getUserFromAuthUUID(userUUID);
            //Get inventoryId
            const inventoryId = await inventoryModel.selectInventoryIdFromUserId(userDataFromTable[0].id);
            
            const userData = await {
                id: userDataFromTable[0].id,
                inventoryId: inventoryId.id,
                firstName: userDataFromTable[0].firstName,
                lastName: userDataFromTable[0].lastName,
                studie: userDataFromTable[0].studie,

            };

            //Parse cookie with access_token on frontend for user's session 
            return res
                .cookie("sb_access_token", userLogin_request.session.access_token, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 // 1 time
                })
                .cookie("userId", userData.id, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 // 1 time
                })
                .cookie("inventoryId", inventoryId.id, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 // 1 time
                })
                .json({ message: "User logged in successfully", user: userData});

    

        } catch (error) {
            console.error("subabase login error:", error.message);
            return res.status(400).json({ message: error.message });
        }
    },

    getCurrentUser: async(req, res) => {
        if(!req.cookies.sb_access_token){
            return res.status(401).json({message: 'no session'});
        }
        
        const userModel = new UserModel();
        const inventoryModel = new InventoryModel();
        const access_token = req.cookies.sb_access_token
        
        try{
            
            const data = await userModel.getCurrentUser(access_token);
            const userUUID = data.user.id
            const userDataFromTable = await userModel.getUserFromAuthUUID(userUUID);
            const inventoryId = await inventoryModel.selectInventoryIdFromUserId(userDataFromTable[0].id);
            const userData = await {
                id: userDataFromTable[0].id,
                inventoryId: inventoryId.id,
                firstName: userDataFromTable[0].firstName,
                lastName: userDataFromTable[0].lastName,
                studie: userDataFromTable[0].studie,
            };



            return res
                .cookie("sb_access_token", access_token, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 // 1 time
                })
                .cookie("userId", userData.id, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 // 1 time
                })
                .cookie("inventoryId", inventoryId.id, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 // 1 time
                })
                .json({success: true, user: userData});
        }catch(error){
            console.log("error")
            return res.status(401).json({message: 'unable to authorize user'});
        }

    }
}

export default userController;