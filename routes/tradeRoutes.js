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
})

router.get('/ongoingTrades/inbound', async(req, res) => {
    await TradeController.getInboundOffersFromUserId(req, res);
})

router.get('/ongoingTrades/outbound', async(req, res) => {
    await TradeController.getOutboundOffersFromUserId(req, res);
})

router.patch('/ongoingTrades/accept/:tradeId', async(req, res) => {
    await TradeController.acceptOffer(req, res);
})

router.patch('/ongoingTrades/decline/:tradeId', async(req, res) => {
    await TradeController.declineOffer(req, res);
})

router.delete('/ongoingTrades/delete/:tradeId', async(req, res) => {
    await TradeController.deleteOffer(req, res);
})

router.post('/confirm/:tradeId',async(req,res) => {
    await TradeController.confirmReceivedTrades(req, res);
})

router.get('/confirm',async(req,res) => {
    await TradeController.getConfirmedTrades(req, res);
})

export const tradeRoutes = router;