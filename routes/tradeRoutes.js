import e from "express";
import supabase from '../supabase.js';
import TradeController from '../controller/TradeController.js';
const router = e.Router();

const _userId = 3
const _inventoryId = 3

/**
 * Trades
 */
router.post('/initiateTrade/:requestedItemId', async(req, res) => {
    await TradeController.initiateTradeOffer(req, res);
    
    /*try{
        const offer = await TradeController.initiateTradeOffer(req, res);
        return res.json({success: true})
    }catch(error){
        console.log(error);
        return res.json({success: false, message: error});
    }*/
})

router.get('/ongoingTrades/inbound', async(req, res) => {
    const userId = _userId; //req.session.id... todo later

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
    const userId = _userId; //req.session.id... todo later

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

router.patch('/ongoingTrades/accept/:tradeId', async(req, res) => {
    const tradeId = req.params.tradeId;

    const {data, error} = await supabase
    .from('trades')
    .update({status: 'accepted'})
    .eq('id',tradeId);

    if(error){
        console.log(error)
        res.json({success: false, message: 'unable to update tradeoffer'})
    }

    return res.json({success: true, message: 'Accepted trade offer'});
})

router.patch('/ongoingTrades/decline/:tradeId', async(req, res) => {
    const tradeId = req.params.tradeId;

    const {data, error} = await supabase
    .from('trades')
    .update({status: 'declined'})
    .eq('id',tradeId);

    if(error){
        console.log(error)
        res.json({success: false, message: 'unable to update tradeoffer'})
    }

    return res.json({success: true, message: 'declined trade offer'});
})

router.delete('/ongoingTrades/delete/:tradeId', async(req, res) => {
    const tradeId = req.params.tradeId;

    const {data, error} = await supabase
    .from('trades')
    .delete()
    .eq('id',tradeId);

    if(error){
        console.log(error)
        return res.json({success: false, message: 'unable to delete trade offer'})
    }

    return res.json({success: true, message: 'trade offer deleted'});
})

export const tradeRoutes = router;