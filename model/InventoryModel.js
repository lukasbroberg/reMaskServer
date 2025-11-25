import supabase from "../supabase.js";

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

    async addItemToInventory(item, inventoryId){

        var {name, description, size} = item;

        const {data, error} = await supabase
        .from('items')
        .insert([
            {
                item_name: name,
                item_description: description,
                item_size: size,
                inventory_id: inventoryId,
            }
        ])
        .select();

        if(error){
            throw new Error(error.message);
        }

        console.log(data)
    }

    async selectUserItemsFromId(userId){
        let { data: items, error } = await supabase
        .from('user_items')
        .select()
        .eq('owner',userId);

        if(error){
            console.log(error.message)
            throw new Error(error.message);
            
        }

        return items;
    }

    async selectItemsFromInventoryId(inventoryId){
        let { data: items, error } = await supabase
            .from('items')
            .select()
            .eq('inventory_id', inventoryId)

        if (error) {
            throw new Error(error.message);
        }

        return items;
    }

    async selectItemFromItemId(itemId){
        let{ data: item, error } = await supabase
            .from('items')
            .select()
            .eq('id',itemId);
        
        if(error){
            throw new Error(error.message);
        }
        return item;
    }

}

export default InventoryModel;