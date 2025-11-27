import e from "express";
import inventoryController from "../controller/InventoryController.js";
import supabase from '../supabase.js';

const router = e.Router();

router.post('/start', async (req, res) => {

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

router.post('/message', async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const authorId = req.cookies.userId;

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

router.get('/:chatId/messages', async (req, res) => {
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



export const chatRoutes = router;