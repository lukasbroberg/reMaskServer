import e from "express";
import cors from 'cors';
import supabase from './supabase.js';
import { userRoutes } from "./routes/userRoutes.js";
import { tradeRoutes } from './routes/tradeRoutes.js';
import { itemRouter } from "./routes/itemRoutes.js";
import { inventoryRouter } from "./routes/inventoryRoutes.js";
import cookieParser from 'cookie-parser';
const app = e();
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})) //To parse data from different origins (urls)

app.use(e.json()); //To parse json objects on requests
app.use(cookieParser()); //To parse cookies

//Trading routes
app.use('/trades',tradeRoutes)
app.use('/user',userRoutes)
app.use('/items',itemRouter);
app.use('/inventory',inventoryRouter);
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

/**
 * Post new costume to database
 */
app.post('/addUserItem', async (req, res) => {

    const { name, description, size } = req.body;
    const inventoryId = 1 //Todo implementer senere, når vi har session Id fra login

    const { data, error } = await supabase.from('items').insert([
        {
            item_name: name,
            item_description: description,
            item_size: size,
            inventory_id: inventoryId,
        }
    ])

    if (error) {
        console.log(error)
        res.json({ success: false, message: 'Unable to insert new costume' })
    }
    res.json({ success: true, message: 'inserted costume' });
})

/**
 * Fetch all costumes from other users
 */
app.get('/fetchNewlyItems', async (req, res) => {
    let { data: items, error } = await supabase
        .from('costumes')
        .select()

    if (error) {
        console.log(error);
    }

    res.json({ success: true, costumes: items });
})

/**
 * To fetch own user items based on session id (mangler sessionId fra login)
 */
app.get('/fetchUserItems', async (req, res) => {
    const userId = 1 //Todo implement as sessionId

    let { data: items, error } = await supabase
        .from('user_items')
        .select()
        .eq('owner', userId);

    console.log(items)

    if (error) {
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
        console.log(error)
    }

    res.json({ success: true, items: items });
})

app.post('/chat/start', async (req, res) => {

    try {
        console.log("chat/start body:", req.body);
        const { tradeId } = req.body;
        console.log("tradeId= ", tradeId, "type= ", typeof tradeId);

        // kontroller om der er en trade igang
        /*const { data: trade, error: tradeErr } = await supabase
            .from('trades')
            .select('id')
            .eq('id', tradeId)
            .maybeSingle(); // skal ændres til single hvis vi er sikre når vi bruger cookies eller sessions

        if (tradeErr || !trade) {
            console.error("trade error: ", tradeErr);
            return res.status(400).json({ message: "Invalid trade ID" });
        }
        */


        // finder existerende chat
        const { data: existingChat, error: existingChatErr } = await supabase
            .from('current_chats')
            .select('id')
            .eq('trade_id', tradeId)
            .maybeSingle();

        console.log("existingChat:", existingChat)

        if (existingChatErr) {
            console.error("existingChat error: ", existingChatErr);
            return res.status(500).json({ message: "Could not check existing chat" });
        }

        let chatId = existingChat?.id || null;

        // hvis ingen chat, opret ny chat
        if (!chatId) {
            const { data: newChat, error: chatErr } = await supabase
                .from('current_chats')
                .insert([{ trade_id: tradeId, active: true }])
                .select("id")
                .single();

            console.log("newChat:", newChat, "chatErr", chatErr)

            if (chatErr) {
                console.error("create chat error:", chatErr);
                return res.status(500).json({ message: "Could not create chat" });
            }

            chatId = newChat.id;
        }
        return res.json({ message: "Chat started", chatId: chatId });
    } catch (err) {
        console.error("chat/start error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }

});

app.post('/chat/message', async (req, res) => {
    try {
        const { chatId, authorId, message } = req.body;

        const { data, error } = await supabase
            .from('chat_messages')
            .insert([{
                chat_id: chatId,
                author_id: authorId,
                message,
            }]);

        if (error) {
            console.error("send message error:", error);
            return res.status(400).json({ message: "Could not send message" });
        }
        return res.json({ succes: true, message: "Message sent" });

    } catch (err) {
        console.error("chat/message error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/chat/:chatId/messages', async (req, res) => {
    try {
        const chatId = req.params.chatId;

        const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
        if (error) {
            console.error("get messages error:", error);
            return res.status(400).json({ message: "Could not fetch messages" });
        }
        return res.json({ messages })
    } catch (err) {
        console.error("chat/:chatId/messages error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});




/**
 * Start server
 */
app.listen(3000, () => {
    console.log(`app is listening on port ${port}`)
})