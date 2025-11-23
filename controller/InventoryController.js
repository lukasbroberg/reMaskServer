import InventoryModel from "../model/InventoryModel.js"

const inventoryController = {
    addItemToInventory: async(req, res) => {

        const {name, description, size} = req.body;
        const inventoryId = 4 //Todo implementer senere, når vi har session Id fra login

        const inventoryModel = new InventoryModel();
        try{
            const addItem = await inventoryModel.addItemToInventory({name, description, size}, inventoryId)
            console.log("vi nåede hertil")
            if(addItem){
                return res.json({success: true, message: 'Item added to inventory'});
                
            }

        }catch(error){
            return res.json({success: false, message: 'Unable to add item to inventory'});
        }
    },
    
    fetchUserItems: async(req,res) => {
        const userId = 4 //req.session.id... Todo implement as sessionId

        var inventoryModel = new InventoryModel();
        try{
            const userItems = await inventoryModel.selectUserItemsFromId(userId);
            return res.json({ success: true, costumes: userItems })
        }catch(error){
            return res.json({success: false, message: error.message});
        }

    },

    fetchInventoryItems: async(req, res) => {
        const inventoryId = req.params.inventoryId;

        var inventoryModel = new InventoryModel();

        try{
            const inventoryItems = await inventoryModel.selectUserItemsFromId(inventoryId);
            return res.json({ success: true, items: inventoryItems });
        }catch(error){
            return res.json({success: false, message: error.message})
        }
    },

    fetchItemOnId: async(req, res) => {
        const itemId = req.params.itemId;
        
        var inventoryModel = new InventoryModel();
        try{
            const item = await inventoryModel.selectItemFromItemId(itemId);
            return res.json({success: true, item: item});
        }
        catch(error){
            return res.status(400)({message: 'unable to get item'});
        }


    
    }
}

export default inventoryController;