import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// opret rating

router.post('/', async (req, res) => {
    const { tradeId, fromUserId, toUserId, rating, } = req.body;

    if (!tradeId || !fromUserId || !toUserId || !rating) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { data: trade, error: tradeError } = await supabase
        .from('trades')
        .select('id, user_from, user_to, status')
        .eq('id', tradeId)
        .maybeSingle();

    if (tradeError || !trade) {
        return res.status(400).json({ success: false, message: "Trade does not exist" });
    }

    if (trade.status !== 'finished') {
        return res.status(400).json({ success: false, message: "Cannot rate unfinished trade" });
    }

    const { data: existingRating, error: existingRatingError } = await supabase
        .from('user_ratings')
        .select('id')
        .eq('trade_id', tradeId)
        .eq('from_user', fromUserId)
        .eq('to_user', toUserId)
        .maybeSingle();

    if (existingRatingError) {
        return res.status(500).json({ success: false, message: "Could not check existing rating" });
    }

    if (existingRating) {
        return res.status(400).json({ success: false, message: " You already rated this trade" });
    }

    const { data, error } = await supabase
        .from('user_ratings')
        .insert([{
            trade_id: tradeId,
            from_user: fromUserId,
            to_user: toUserId,
            rating: rating,
        }]);

    if (error) {
        console.error("create rating error:", error);
        return res.status(500).json({ success: false, message: "Could not create rating" });
    }
    res.json({ success: true, message: "Rating created", rating: data });
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        console.log("Fetching ratings for userId:", userId), "type = " + typeof userId;

        const numericUserId = Number(userId);

        const { data, error } = await supabase
            .from('user_ratings')
            .select('*')
            .eq('to_user', numericUserId);

        if (error) {
            console.log("get rating error")
            return res.status(500).json({ success: false, message: "Could not fetch ratings" });
        }

        res.status(200).json({ success: true, ratings: data });
    } catch (err) {
        console.error("get ratings error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export const ratingRoutes = router;