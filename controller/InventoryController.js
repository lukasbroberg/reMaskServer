import InventoryModel from "../model/InventoryModel.js"
import supabase from "../supabase.js";

const _userId = 3
const _inventoryId = 3

const inventoryController = {
    addItemToInventory: async (req, res) => {

        const {name, description, size} = req.body;
        const imageFile = req.file; // Multer adds the file to req.file
        const inventoryId = req.cookies.inventoryId

        const inventoryModel = new InventoryModel();
        try {
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await inventoryModel.addImageToStorage(imageFile);
            }

            //const imageUrl = await inventoryModel.addImageToStorage(image);

            const addItem = await inventoryModel.addItemToInventory({ name, description, size, imageUrl }, inventoryId)
            return res.json({ success: true, message: 'Item added to inventory', item: addItem });


        } catch (error) {
            console.error("addItemToInventory error:", error);
            return res
                .status(500)
                .json({ success: false, message: 'Unable to add item to inventory' });
        }
    },
    
    fetchUserItems: async(req,res) => {

        if(!req.cookies.userId){
            return res.status(401).json({success: false, message: 'unable to authorize user'});
        }

        const userId = req.cookies.userId

        var inventoryModel = new InventoryModel();
        try {
            const userItems = await inventoryModel.selectUserItemsFromId(inventoryid);
            return res.json({ success: true, costumes: userItems })
        } catch (error) {
            console.log(error);
            return res.json({ success: false, message: error.message });
        }

    },

    fetchInventoryItems: async (req, res) => {
        const inventoryId = req.params.inventoryId;

        var inventoryModel = new InventoryModel();

        try {
            const inventoryItems = await inventoryModel.selectUserItemsFromId(inventoryId);
            return res.json({ success: true, items: inventoryItems });
        }catch(error){
            console.log(error)
            return res.json({success: false, message: 'unable to get users costumes'})
        }
    },

    fetchItemOnId: async (req, res) => {
        const itemId = req.params.itemId;

        var inventoryModel = new InventoryModel();
        try {
            const item = await inventoryModel.selectItemFromItemId(itemId);
            return res.json({ success: true, item: item });
        }
        catch (error) {
            return res.status(400)({ message: 'unable to get item' });
        }
    }
}

export default inventoryController;