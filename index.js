import e from "express";
import cors from 'cors';
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config({ path: './supabase.env' });
//const dotenv = dotenv.config();
const supabaseUrl = 'https://kjtbrqhsvdakypduvhdp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdGJycWhzdmRha3lwZHV2aGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTA0NjUsImV4cCI6MjA3NzgyNjQ2NX0.dQ7A4waTq4d1TqXMZs9ppAM3KvR0kd2AzMKCh7yYqSs'//'process.env.supabaseKey'
const supabase = createClient(supabaseUrl, supabaseKey)
const app = e();
const port = 3000;

app.use(cors()) //To parse data from different origins (urls)
app.use(e.json()); //To parse json objects on requests

app.post('/signUp', async (req, res) => {
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

app.post('/login', async (req, res) => {

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

/**
 * Post new costume to database
 */
app.post('/addUserItem', async (req,res) => {

    const {name, description, size} = req.body;
    const inventoryId = 3 //Todo implementer senere, når vi har session Id fra login

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

    if (error) {
        res.json({success: false, message: 'unable to get newest posted costumes'})
        console.log(error);
    }

    res.json({ success: true, costumes: items });
})

/**
 * To fetch own user items based on session id (mangler sessionId fra login)
 */
app.get('/fetchUserItems', async (req, res) => {
    const userId = 3 //req.session.id... Todo implement as sessionId
    let { data: items, error } = await supabase
    .from('user_items')
    .select()
    .eq('owner',userId);

    if(error){
        res.json({success: false, message: 'unable to get users costumes'})
        console.log(error)
    }

    res.json({ success: true, costumes: items })


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

    if (error) {
        res.json({success: false, message: 'unable to get newest posted costumes'})
        console.log(error)
    }

    res.json({ success: true, items: items });
})

/**
 * Trades
 */
app.post('/trades/initiateTrade', async(req, res) => {
    const {offer, receive, toUser} = req.body;
    const userId = 3; //req.session... todo later
    console.log(offer+" "+receive+" "+toUser);
})

app.get('/trades/ongoingTrades/inbound', async(req, res) => {
    const userId = 3; //req.session.id... todo later

    const {data, error} = await supabase
    .from('tradeoffer_items_view')
    .select()
    .eq('user_to',userId);

    if(error){
        console.log(error)
        res.json({success: false, message: 'Unable to get inbound trade offers'})
    }

    console.log(data)

    res.json({success: true, inboundTrades: data});
})

app.get('/trades/ongoingTrades/outbound', async(req, res) => {
    const userId = 3; //req.session.id... todo later

    const {data, error} = await supabase
    .from('tradeoffer_items_view')
    .select()
    .eq('user_from',userId);

    if(error){
        console.log(error)
        res.json({success: false, message: 'Unable to get outbound trade offers'})
    }
    console.log("outbound")
    console.log(data)

    res.json({success: true, outboundTrades: data});
})

app.post('/trades/ongoingTrades/accept/:id', async(req, res) => {
    const tradeId = req.params.id;
})

app.post('/trades/ongoingTrades/decline/:id', async(req, res) => {
    const tradeId = req.params.id;
})

/**
 * Start server
 */
app.listen(3000, () => {
    console.log(`app is listening on port ${port}`)
})