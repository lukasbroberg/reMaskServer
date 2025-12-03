import InventoryModel from "../model/InventoryModel.js"

const inventoryController = {
    /** Inserts a new item to the inventory
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    addItemToInventory: async (req, res) => {

        //Early exit due to missing data
        if(req.cookies.inventoryId==null || req.cookies.userId==null || req.cookies.sb_access_token==null){
            console.log("error")
            return res
                .status(401)
                .json({message: 'user needs to be signed in to upload costumes'});
        }

        if(!req.file){
            return res.status(422).json({message: 'Unable to find image'})
        }

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

        //Early exit due to missing data
        if(!req.cookies.inventoryId){
            return res
                .status(401)
                .json({success: false, message: 'unable to authorize user'});
        }

        const inventoryId = req.cookies.inventoryId

        var inventoryModel = new InventoryModel();
        try {
            const userItems = await inventoryModel.selectUserItemsFromInventoryId(inventoryId) //inventoryModel.selectUserItemsFromId(userId);
            return res.json({ success: true, costumes: userItems })
        } catch (error) {
            console.log(error);
            return res.json({ success: false, message: error.message });
        }

    },

    fetchInventoryItems: async (req, res) => {
        
        //Early exit due to missing data
        if(!req.params.inventoryId){
            return res
                .status(400)
                .json({success: false, message: 'unable to get users costumes'})
        }

        const inventoryId = req.params.inventoryId;


        var inventoryModel = new InventoryModel();

        try {
            const inventoryItems = await inventoryModel.selectAvailableUserItemsFromInventoryId(inventoryId);
            return res.json({ success: true, items: inventoryItems });
        }catch(error){
            return res.json({success: false, message: 'unable to get users costumes'})
        }
    },

    fetchItemOnId: async (req, res) => {
        const itemId = req.params.itemId;

        //Early exit due to missing data
        if(!itemId){
            return res.status(400)({ message: 'unable to get item' });
        }

        var inventoryModel = new InventoryModel();
        try {
            const item = await inventoryModel.selectItemFromItemId(itemId);
            return res.json({ success: true, item: item });
        }
        catch (error) {
            return res.status(400)({ message: "unable to get item" });
        }
    },

    updateItemOnId: async(req, res) => {
        if(!req.params.itemId){
            return res
                .status(401)
                .json({message: 'user is not signed in'})
        }

        //Early exit due to missing data
        if(!req.body){
            return res
            .status(422)
            .json({message: "Intet at opdatere"});
        }

        const itemId = req.params.itemId;
        const {name, description, size} = req.body;
        var inventoryModel = new InventoryModel();
        
        try{
            const updateRequest = await inventoryModel.updateItemFromId(itemId, {name, description, size});
            return res.json({success: true, message: "Opslag er blevet opdateret."})  
        }catch(error){
            return res.json({success: false, message: "kunne ikke updatere opslag"});
        }
    },

    deleteItemOnId: async(req, res) => {
        if(!req.params.itemId){
            return res.json({
                success: false, message: "Ikke muligt at slette opslag"
            });
        }

        const itemId = req.params.itemId;

        var inventoryModel = new InventoryModel();
        try{
            const deleteRequest = await inventoryModel.deleteItemOnId(itemId);
            return res.json({
                success: true, message: "Opslag er blevet slettet"
            });
        }catch(error){
            return res.json({
                success: false, message: "Ikke muligt at slette opslag"
            });
        }
    }
}

export default inventoryController;