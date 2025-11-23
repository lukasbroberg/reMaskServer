import InventoryModel from "../model/InventoryModel.js";
import TradeModel from "../model/TradeModel.js";
import supabase from '../supabase.js';

const TradeController = {
    initiateTradeOffer: async (req, res) => {
        const requestedItemId = req.params.requestedItemId;
        const user_fromId = 4 //req.session.id todo later
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
        const insertItemRequest_receive = await tradeModel.insertNewTradeItem(requestedItemId,"receive",tradeId);
        console.log("request insert succesful");
        return res.json({success: true, message: 'Offer created'});
    },
};

export default TradeController;