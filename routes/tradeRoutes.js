import e from "express";
import supabase from '../supabase.js';
import TradeController from '../controller/TradeController.js';
const router = e.Router();

/**
 * Trades
 */
router.post('/initiateTrade/:requestedItemId', async(req, res) => {
    try{
        TradeController.initiateTradeOffer(req, res);
    }catch(error){
        console.log(error);
        return res.json({success: false, message: error});
    }
})

router.get('/ongoingTrades/inbound', async(req, res) => {
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

router.get('/ongoingTrades/outbound', async(req, res) => {
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

router.post('/ongoingTrades/accept/:id', async(req, res) => {
    const tradeId = req.params.id;
})

router.post('/ongoingTrades/decline/:id', async(req, res) => {
    const tradeId = req.params.id;
})

export const tradeRoutes = router;