import InventoryModel from "../model/InventoryModel.js";
import TradeModel from "../model/TradeModel.js";
import supabase from '../supabase.js';

const TradeController = {
    initiateTradeOffer: async (req, res) => {
        if(!req.cookies.userId || !req.cookies.sb_access_token){
            return res
                .status(401)
                .json({success: false, message: 'Unable to create trade offers, when user is not signed in.'});
        }


        const requestedItemId = req.params.requestedItemId;
        const user_fromId = req.cookies.userId;
        const {offerItems, toInventory} = req.body;

        
        const inventoryModel = new InventoryModel();
        const tradeModel = new TradeModel();

        const user_to = await inventoryModel.getOwnerIdFromInventoryId(toInventory);
        
        //Early exits
        if(offerItems == []){
            return res.json({success: false, message: 'No items selected'});
        }

        if(requestedItemId==null){
            return res.json({success: false, message: 'No items selected'});
        }
        
        if(toInventory==null){
            return res.json({success: false, message: 'Missing inventory id'});
        }
        
        if(user_fromId==user_to){
            console.log("alle checks passed!");
            return res.json({success: false, message: 'Unable to send trade offer to self'});
        }
        
        //Create a new empty trade
        const requestNewTrade = await tradeModel.createNewTrade(user_fromId, user_to);
        const tradeId = requestNewTrade[0].id;

        //Insert all offered items in trade

        console.log(offerItems);
        for(var i=0; i<offerItems.length; i++){
            console.log(offerItems[i]);
            try{
                const insertItemsRequest = await tradeModel.insertNewTradeItem(offerItems[i].id,"offer",tradeId);
            }catch(error){
                console.log(error);
                return;
            }
            console.log("Insert succesful");
        }

        //Insert the requested item in trade
        try{
            console.log(requestedItemId);
            const insertItemRequest_receive = await tradeModel.insertNewTradeItem(requestedItemId,"receive",tradeId);
            console.log("Insert succesful");
        }catch(err){
            console.log(err);
            return res
            .status(400)
            .json({message: 'Unable to create trade offer'});
        }

        return res.json({success: true, message: 'Offer created'});
    },

    getInboundOffersFromUserId: async(req, res) => {
        
        if(!req.cookies.userId){
            return res
            .status(401)
            .json({message: 'User is not signed in'})
        }

        const userId = req.cookies.userId; 
        const tradeModel = new TradeModel();
        try{
            const inboundTrades = await tradeModel.selectInboundFromUserId(userId);
            return res.json({success: true, inboundTrades: inboundTrades});
        }catch(error){
            return res.json({success: false, message: 'Unable to get inbound trade offers'})
        }
    
    },

    getOutboundOffersFromUserId: async(req, res) => {
        
        if(!req.cookies.userId){
            return res
            .status(401)
            .json({success: false, message: 'User is not signed'})
        }

        const userId = req.cookies.userId; //req.session.id... todo later
        const tradeModel = new TradeModel();
        try{
            const outboundTrades = await tradeModel.selectOutboundFromUserId(userId);
            return res.json({success: true, outboundTrades: outboundTrades});
        }catch(error){
            return res.json({success: false, message: 'Unable to get outbound trade offers'})
        }
    },

    acceptOffer: async(req, res) => {
        
        if(!req.params.tradeId){
            return res
            .status(401)
            .json({success: false, message: 'Trade doesnt exist'})
        }

        const tradeId = req.params.tradeId;
        const tradeModel = new TradeModel();
        try{
            const acceptRequest = await tradeModel.acceptTrade(tradeId);
            return res.json({success: true, message: 'Accepted trade offer'});
        }catch(error){
            return res
            .status(400)
            .json({success: false, message: 'unable to update tradeoffer'})
        }
    },

    declineOffer: async(req, res) => {
        if(!req.params.tradeId){
            return res
            .status(401)
            .json({success: false, message: 'Trade doesnt exist'})
        }

        const tradeId = req.params.tradeId;
        const tradeModel = new TradeModel();

        try {
            const declineRequest = await tradeModel.declineTrade(tradeId);
            return res.json({success: true, message: 'declined trade offer'});
        } catch (error) {
            res.json({success: false, message: 'unable to update tradeoffer'})
        }
    },

    deleteOffer: async(req, res) => {
        /**
         * TODO: Verify its the correct user
         */

        if(!req.params.tradeId){
            return res
                .status(422)
                .json({message: 'No trade id'})
        }
        const tradeId = req.params.tradeId;
        const tradeModel = new TradeModel();

        try{
            const deleteRequest = await tradeModel.deleteTrade(tradeId);
            return res.json({success: true, message: 'trade offer deleted'});
        }catch(error){
            return res
            .status(400)
            .json({success: false, message: 'unable to delete trade offer'})
        }
    },

    confirmReceivedTrades: async(req, res) => {
        if(!req.cookies.userId || !req.params.tradeId){
            return res
                .status(400)
                .json({message: 'User is not signed in'})
        }

        const userId = req.cookies.userId;
        const tradeId = req.params.tradeId; //req.session.id... todo later
        const tradeModel = new TradeModel();
        try{
            const confirmReceivedItems_req = await tradeModel.insertOnTradeReceived(tradeId, userId);
            return res.json({success: true});
        }catch(error){
            return res.json({success: false, message: 'Unable to confirm received items'});
        }
    },

    getConfirmedTrades: async(req, res) => {
        const userId = req.cookies.userId;
        const tradeModel = new TradeModel();
        try{
            const getConfirmedTrades_req = await tradeModel.selectTradeItemsReceived(userId);
            return res.json({success: true, confirmedTrades: getConfirmedTrades_req});
        }catch(error){
            return res.json({success: false, message: 'Unable to confirm received items'});
        }
    }
};

export default TradeController;