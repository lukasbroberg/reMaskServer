class InventoryModel{
    //Create tradeOffer (simplificer det her)
    async getOwnerIdFromInventoryId(inventoryId){
        let {data, error} = await supabase
            .from('inventory')
            .select('owner')
            .eq('id',inventoryId);

        if(error){
            console.log(error);
        }

        const owner = data[0].owner
        return owner
    }

}

export default InventoryModel;