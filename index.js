import e from "express";
import cors from 'cors';
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config({path: './supabase.env'});
//const dotenv = dotenv.config();
const supabaseUrl = 'https://kjtbrqhsvdakypduvhdp.supabase.co'
const supabaseKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdGJycWhzdmRha3lwZHV2aGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTA0NjUsImV4cCI6MjA3NzgyNjQ2NX0.dQ7A4waTq4d1TqXMZs9ppAM3KvR0kd2AzMKCh7yYqSs'//'process.env.supabaseKey'
const supabase = createClient(supabaseUrl, supabaseKey)
const app = e();
const port = 3000;

app.use(cors()) //To parse data from different origins (urls)
app.use(e.json()); //To parse json objects on requests


/**
 * Post new costume to database
 */
app.post('/addUserItem', async (req,res) => {

    const {name, description, size} = req.body;
    const inventoryId = 1 //Todo implementer senere, når vi har session Id fra login

    const {data, error} = await supabase.from('items').insert([
        {
            item_name: name,
            item_description: description,
            item_size: size,
            inventory_id: inventoryId,
        }
    ])

    if(error){
        console.log(error)
        res.json({success: false, message: 'Unable to insert new costume'})
    }
    res.json({success: true, message: 'inserted costume'});
})

/**
 * Fetch all costumes from other users
 */
app.get('/fetchNewlyItems', async (req, res) => {
    let { data: items, error } = await supabase
    .from('costumes')
    .select()

    if(error){
        console.log(error);
    }

    res.json({success: true, costumes: items});
})

/**
 * To fetch own user items based on session id (mangler sessionId fra login)
 */
app.get('/fetchUserItems', async(req, res) => {
    const userId = 1 //Todo implement as sessionId
    
    let { data: items, error } = await supabase
    .from('user_items')
    .select()
    .eq('owner',userId);

    console.log(items)

    if(error){
        console.log(error)
    }

    res.json({success: true, costumes: items})


    //res.json({success: true, costumes: items});
})

/**
 * To fetch items based on a given inventoryId
 */
app.get('/fetchUserItems/:inventoryId', async (req, res) => {
    const inventoryId = req.params.inventoryId;
    
    let { data: items, error } = await supabase
    .from('items')
    .select()
    .eq('inventory_id', inventoryId)

    if(error){
        console.log(error)
    }

    res.json({success: true, items: items});
})



/**
 * Start server
 */
app.listen(3000, () => {
    console.log(`app is listening on port ${port}`)
})