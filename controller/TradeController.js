import InventoryModel from "../model/InventoryModel";
import TradeModel from "../model/TradeModel";
import supabase from '../supabase.js';

const TradeController = {
    initiateTradeOffer: async (req, res) => {
        const requestedItemId = req.params.requestedItemId;
        const user_fromId = 3 //req.session.id todo later
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
            return res.json({success: false, message: 'Unable to send trade offer to self'});
        }

        //Create a new empty trade
        const requestNewTrade = await tradeModel.createNewTrade(user_to);
        const tradeId = requestNewTrade[0].id;

        //Insert all offered items in trade
        for(var i=0; i<offerItems.length; i++){
            console.log(offerItems[i]);
            try{
                const insertItemsRequest = await insertNewTradeItem(offerItems[i].id,"offer",tradeId);
            }catch(error){
                console.log(error);
                return;
            }
        }

        //Insert the requested item in trade
        const insertItemRequest_receive = await insertNewTradeItem(requestedItemId,"receive",tradeId);
        return res.json({success: true, message: 'Offer created'});
    },
};

export default TradeController;