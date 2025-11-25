import InventoryModel from "../model/InventoryModel.js"

const _userId = 3
const _inventoryId = 3

const inventoryController = {
    addItemToInventory: async(req, res) => {

        const {name, description, size} = req.body;
        const inventoryId = _inventoryId //Todo implementer senere, når vi har session Id fra login

        const inventoryModel = new InventoryModel();


            if (!name || !description || !size) {
        return res.status(400).json({
            success: false,
            message: "Fields cannot be empty"
        });
    }

    if (name.trim() === "" || description.trim() === "" || size.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Fields cannot be empty"
        });
    }
        try{
            const addItem = await inventoryModel.addItemToInventory({name, description, size}, inventoryId)
            if(addItem){
                return res.json({success: true, message: 'Item added to inventory'});
                
            }

        }catch(error){
            return res.json({success: false, message: 'Unable to add item to inventory'});
        }
    },
    
    fetchUserItems: async(req,res) => {
        const userId = _inventoryId //req.session.id... Todo implement as sessionId

        var inventoryModel = new InventoryModel();
        try{
            const userItems = await inventoryModel.selectUserItemsFromId(userId);
            return res.json({ success: true, costumes: userItems })
        }catch(error){
            console.log(error);
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