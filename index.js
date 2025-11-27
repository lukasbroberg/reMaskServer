import e from "express";
import cors from 'cors';
import supabase from './supabase.js';
import { userRoutes } from "./routes/userRoutes.js";
import { tradeRoutes } from './routes/tradeRoutes.js';
import { itemRouter } from "./routes/itemRoutes.js";
import { inventoryRouter } from "./routes/inventoryRoutes.js";
import cookieParser from 'cookie-parser';
import { chatRoutes } from "./routes/chatRoutes.js";
import { ratingRoutes } from "./routes/ratingRoutes.js";
const app = e();
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(e.json()); //To parse json objects on requests
app.use(cookieParser()); //To parse cookies

//Trading routes
//app.use(authMiddleware); //Fjern kommentar, når den skal bruges
app.use('/user', userRoutes)
app.use('/chat', chatRoutes)
app.use('/trades', tradeRoutes)
app.use('/items', itemRouter);
app.use('/inventory', inventoryRouter);
app.use('/ratings', ratingRoutes);

async function authMiddleware(req, res, next) {
    
    const token = req.cookies.sb_access_token;
    if (!token) {
        return res.status(401).json({ message: "Not logged in" });
    }
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        console.error("authMiddleware error:", error?.message);
        return res.status(401).json({ message: "invalid session" });
    }

    req.user = data.user;
    next();
}


app.delete('/deleteItem/:itemId', async (req, res) => {
    
    const itemId = req.params.itemId;
    console.log(itemId)
    //validate user id and that the user owns the item

    const {data, error} = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);

    if (error) {
        console.log(error);
        return res.json({
            success: false, message: "Ikke muligt at slette opslag"
        });

    }

    return res.json({
        success: true, message: "Opslag er blevet slettet"
    });
})



app.put('/updateItem/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    const {name, description, size}=req.body;

    const {data, error} = await supabase
        .from('items')
        .update({
            item_name: name,
            item_description: description,
            item_size: size
        })
        .eq('id', itemId)
    if (error) {
        console.log(error);
        return res.json({success: false, message: "kunne ikke updatere opslag"});
    }  
    return res.json({success: true, message: "Opslag er blevet opdateret."})  
});

/**
 * Start server
 */
app.listen(3000, () => {
    console.log(`app is listening on port ${port}`)
})