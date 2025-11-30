import supabase from "../supabase.js";

class TradeModel{
    /** Creates an empty trade in database
     * 
     * @param {*} userTo 
     * @returns the data for the new trade row 
     */
    async createNewTrade(userFromId, userToId){
        let {data, error} = await supabase
        .from('trades')
        .upsert({user_from: userFromId, user_to: userToId})
        .select();
        
        if(error){
            console.log(error);
            throw new Error(error.message)
        }
        
        return data;
    }

    /** Inserts items for a given trade
     * 
     * @param {*} itemId the id of the item
     * @param {*} type the type: eithe receive or offer
     * @param {*} tradeId the id for the trade
     */
    async insertNewTradeItem(itemId, type, tradeId){
        const {data, error} = await supabase
            .from('trade_items')
            .insert({item_id: itemId, trade_id: tradeId, type: type})
        
        if(error){
            throw new Error('unable to insert items');
        }
        return 
    }

    async selectInboundFromUserId(userId){
        const {data, error} = await supabase
        .from('tradeoffer_items_view')
        .select()
        .eq('user_to',userId);
    
        if(error){
            throw new Error(error.message);
        }

        return data;
    }

    async selectOutboundFromUserId(userId){
        const {data, error} = await supabase
        .from('trade_items_overview')
        .select()
        .eq('user_from',userId);

        if(error){
            throw new Error(error.message);
        }
        return data;
    }

    async acceptTrade(tradeId){
        const {data, error} = await supabase
        .from('trades')
        .update({status: 'accepted'})
        .eq('id',tradeId);

        if(error){
            throw new Error(error.message);
        }
    }

    async declineTrade(tradeId){
        const {data, error} = await supabase
        .from('trades')
        .update({status: 'declined'})
        .eq('id',tradeId);

        if(error){
            throw new Error(error.message);
        }
        return data;
    }

    async deleteTrade(tradeId){
        const {data, error} = await supabase
        .from('trades')
        .delete()
        .eq('id',tradeId);

        if(error){
            throw new Error(error.message);
        }
    }

    async insertOnTradeReceived(tradeId, userId){
        const {data, error} = await supabase
        .from('trade_items_received')
        .insert({tradeId: tradeId, userId: userId})

        if(error){
            throw new Error(error.message);
        }
    }

    async selectTradeItemsReceived(userId){
        const {data, error} = await supabase
        .from('trade_items_received')
        .select('tradeId')
        .eq('userId',userId);

        if(error){
            throw new Error(error.message);
        }

        return data;
    }

}

/* verify user_from exists
        const { data: userFromExists } = await supabase
            .from("users")
            .select("id")
            .eq("id", user_fromId)
            .single();

        if (!userFromExists) {
            return res.status(400).json({
                success: false,
                message: "Sender user does not exist"
            });
        }

        // verify user_to exists
        const { data: userToExists } = await supabase
            .from("users")
            .select("id")
            .eq("id", user_to)
            .single();

        if (!userToExists) {
            return res.status(400).json({
                success: false,
                message: "Receiver user does not exist"
            });
        }
            */

export default TradeModel;