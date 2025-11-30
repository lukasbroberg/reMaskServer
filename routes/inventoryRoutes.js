import e from "express";
import supabase from '../supabase.js';
import inventoryController from "../controller/InventoryController.js";
import multer from "multer";

const router = e.Router();
const upload = multer(); // Initialize multer for handling multipart/form-data

/**
 * Post new costume to database
 */
router.post(
    '/addUserItem',
    upload.single('image'),
    inventoryController.addItemToInventory
);

/**
 * To fetch own user items based on session id (mangler sessionId fra login)
 */
router.get('/fetchItems', async (req, res) => {
    await inventoryController.fetchUserItems(req, res);
})

/**
 * To fetch items based on a given inventoryId
 */
router.get('/fetchItems/:inventoryId', async (req, res) => {
    await inventoryController.fetchInventoryItems(req, res);
})

/**
 * get item details from item Id
 */
router.get('/getItem/:itemId', async (req, res) => {
    await inventoryController.fetchItemOnId(req, res);
})

//Update item from inventory
router.put('/updateItem/:itemId', async(req, res) => {
    await inventoryController.updateItemOnId(req, res);
})

//Delete item from inventory
router.delete('/deleteItem/:itemId', async(req, res) => {
    await inventoryController.deleteItemOnId(req, res);    
})

export const inventoryRouter = router;