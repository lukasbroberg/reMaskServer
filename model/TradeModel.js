class TradeModel{

    /** Creates an empty trade in database
     * 
     * @param {*} userTo 
     * @returns the data for the new trade row 
     */
    async createNewTrade(userTo){
        let {data, error} = await supabase
        .from('trades')
        .upsert({user_from: user_fromId, user_to: userTo})
        .select();
        
        if(error){
            console.log(error);
            throw new Error(error)
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
    }

}

export default TradeModel;