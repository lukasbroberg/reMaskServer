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
 * Start server
 */
app.listen(3000, () => {
    console.log(`app is listening on port ${port}`)
})