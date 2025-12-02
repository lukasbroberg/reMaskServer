import supabase from "../supabase.js";

class InventoryModel {
    
    /** Selects the foreign key from user id based on inventoryId
     * 
     * @param {*} inventoryId 
     * @returns an integer with the user id
     */
    async getOwnerIdFromInventoryId(inventoryId) {
        let { data, error } = await supabase
            .from('inventory')
            .select('owner')
            .eq('id', inventoryId);

        if (error) {
            throw new Error(error.message);
        }

        const owner = data[0].owner
        return owner
    }

    /** 
     * 
     * @param {*} image 
     * @returns 
     */
    async addImageToStorage(image) {
        const fileName = `${Date.now()}_${image.originalname}`;
        const { data, error } = await supabase
            .storage
            .from('costume_images')
            .upload(fileName, image.buffer, {
                contentType: image.mimetype,
            });

        if (error) {
            console.error('supabase upload error: ', error);
            throw new Error(error.message);
        }

        const { data: publicData, error: publicError } = supabase
            .storage
            .from('costume_images')
            .getPublicUrl(fileName);

        if (publicError) {
            console.error('supabase get public url error: ', publicError);
            throw new Error(publicError.message);
        }

        return publicData.publicUrl;

    }

    async addItemToInventory(item, inventoryId) {
        var { name, description, size, imageUrl } = item;

        const { data, error } = await supabase
            .from('items')
            .insert([
                {
                    item_name: name,
                    item_description: description,
                    item_size: size,
                    inventory_id: inventoryId,
                    image_url: imageUrl
                }
            ])
            .select();

        if (error) {
            throw new Error(error.message);
        }

        console.log(data)
    }

    async selectUserItemsFromInventoryId(inventoryId) {
        let { data: items, error } = await supabase
            .from('costumes')
            .select()
            .eq('inventory_id', inventoryId);
        if(error){
            console.log(error.message)
            throw new Error(error.message);
        }

        return items;
    }

    async selectAvailableUserItemsFromInventoryId(inventoryId){
        let { data: items, error } = await supabase
            .from('costumes')
            .select()
            .neq('is_accepted',true)
            .eq('inventory_id', inventoryId);
        if(error){
            console.log(error.message)
            throw new Error(error.message);
        }

        return items;
    }

    async selectItemsFromInventoryId(inventoryId) {
        let { data: items, error } = await supabase
            .from('items')
            .select()
            .eq('inventory_id', inventoryId)

        if (error) {
            throw new Error(error.message);
        }

        return items;
    }

    async selectItemFromItemId(itemId) {
        let { data: item, error } = await supabase
            .from('items')
            .select()
            .eq('id', itemId);

        if (error) {
            throw new Error(error.message);
        }
        return item;
    }

    async selectInventoryIdFromUserId(userId){
        let {data, error} = await supabase
            .from('inventory')
            .select('id')
            .eq('owner', userId);
        
        if(error){
            throw new Error(error.message);
        }
        return data[0];

    }

    async updateItemFromId(itemId, item){
        const {data, error} = await supabase
            .from('items')
            .update({
                item_name: item.name,
                item_description: item.description,
                item_size: item.size
            })
            .eq('id', itemId)
        if (error) {
            throw new Error(error.message);
        }  
        return data;
    }

    async deleteItemOnId(itemId){
        const {data, error} = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

        if (error) {
            throw new Error(error.message);
        }
        
        return data;

    }

}

export default InventoryModel;