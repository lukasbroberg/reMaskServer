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

    /** Insert trade item for a given trade
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

    /** Selects the given incoming trades for an userId
     * 
     * @param {*} userId 
     * @returns an array trade_items, with corresponding tradeId
     */
    async selectInboundFromUserId(userId){
        const {data, error} = await supabase
        .from('trade_items_overview')
        .select()
        .eq('user_to',userId)
        .order('created_at', {ascending: false});
    
        if(error){
            throw new Error(error.message);
        }

        return data;
    }

    /** Selects the outgoing trades for a given user
     * 
     * @param {*} userId 
     * @returns An array with trade_items, with corresponding tradeId
     */
    async selectOutboundFromUserId(userId){
        const {data, error} = await supabase
        .from('trade_items_overview')
        .select()
        .eq('user_from',userId)
        .order('created_at', {ascending: false});

        if(error){
            throw new Error(error.message);
        }
        return data;
    }

    /** Updates trade's status to accept
     * 
     * @param {*} tradeId 
     */
    async acceptTrade(tradeId){
        const {data, error} = await supabase
        .from('trades')
        .update({status: 'accepted'})
        .eq('id',tradeId);

        if(error){
            throw new Error(error.message);
        }
    }

    /** Updates trade's status to declined
     * 
     * @param {*} tradeId 
     * @returns 
     */
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

    /** Delete's a given trade from the database
     * 
     * @param {*} tradeId 
     */
    async deleteTrade(tradeId){
        const {data, error} = await supabase
        .from('trades')
        .delete()
        .eq('id',tradeId);

        if(error){
            throw new Error(error.message);
        }
    }

    /** Inserts userId and tradeId on trade_items_received
     * 
     * @param {*} tradeId 
     * @param {*} userId 
     */
    async insertOnTradeReceived(tradeId, userId){
        console.log(tradeId);
        console.log(userId);
        const {data, error} = await supabase
        .from('trade_items_received')
        .insert({tradeId: tradeId, userId: userId})

        if(error){
            console.log(error);
            throw new Error(error.message);
        }
    }

    /** Selects given user's received_items row
     * 
     * @param {*} userId 
     * @returns an array with with all the trade_receieved for the given user
     */
    async selectTradeItemsReceived(userId){
        const {data, error} = await supabase
        .from('trade_items_received')
        .select('tradeId')
        .eq('userId',userId)

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