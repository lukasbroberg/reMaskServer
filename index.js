import e from "express";
import cors from 'cors';
import supabase from './supabase.js';
import { userRoutes } from "./routes/userRoutes.js";
import { tradeRoutes } from './routes/tradeRoutes.js';
import { itemRouter } from "./routes/itemRoutes.js";
import { inventoryRouter } from "./routes/inventoryRoutes.js";

const app = e();
const port = 3000;

app.use(cors()) //To parse data from different origins (urls)
app.use(e.json()); //To parse json objects on requests

//Trading routes
app.use('/trades',tradeRoutes)
app.use('/user',userRoutes)
app.use('/items',itemRouter);
app.use('/inventory',inventoryRouter);

/**
 * To fetch items based on a given inventoryId
 */
app.get('/fetchUserItems/:inventoryId', async (req, res) => {
    const inventoryId = req.params.inventoryId;


    let { data: items, error } = await supabase
        .from('items')
        .select()
        .eq('inventory_id', inventoryId)

    if (error) {
        res.json({success: false, message: 'unable to get newest posted costumes'})
        console.log(error)
    }

    res.json({ success: true, items: items });
})

app.get('/inventory/getItem/:itemId', async(req,res) => {
    const itemId = req.params.itemId;


    let{data: item, error} = await supabase
        .from('items')
        .select()
        .eq('id',itemId);
    
    if(error){
        res.status(400)({message: 'unable to get item'})
    }

    res.json({success: true, item: item})
})

/**
 * Start server
 */
app.listen(3000, () => {
    console.log(`app is listening on port ${port}`)
})