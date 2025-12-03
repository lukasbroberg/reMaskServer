import inventoryController from "../controller/InventoryController.js";

// Mock the InventoryModel constructor + all its methods
jest.mock("../model/InventoryModel.js", () => {
    return jest.fn().mockImplementation(() => ({
        addImageToStorage: jest.fn().mockResolvedValue("http://image"),
        addItemToInventory: jest.fn().mockResolvedValue({ id: 1 }),
        selectUserItemsFromInventoryId: jest.fn().mockResolvedValue([{ id: 1, name: "Hat" }]),
        selectAvailableUserItemsFromInventoryId: jest.fn().mockResolvedValue([{ id: 1 }]),
        selectItemFromItemId: jest.fn().mockResolvedValue({ id: 1, name: "Shirt" }),
        updateItemFromId: jest.fn().mockResolvedValue(true),
        deleteItemOnId: jest.fn().mockResolvedValue(true)
    }));
});

describe("Inventory Controller", () => {

    beforeEach(() => jest.clearAllMocks());

    // -----------------------------
    // addItemToInventory
    // -----------------------------
    test("addItemToInventory -> Missing image returns 422 + correct message", async () => {
        const req = {
            cookies: { inventoryId: 3, userId: 1, sb_access_token: "abc" },
            file: null
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await inventoryController.addItemToInventory(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Unable to find image" });
    });

    test("addItemToInventory -> Success returns correct success message", async () => {
        const req = {
            cookies: { inventoryId: 3, userId: 1, sb_access_token: "abc" },
            file: { filename: "test.jpg" },
            body: { name: "Hat", description: "desc", size: "L" }
        };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await inventoryController.addItemToInventory(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Item added to inventory",
            item: { id: 1 }
        });
    });

    // -----------------------------
    // fetchUserItems
    // -----------------------------
    test("fetchUserItems -> success", async () => {
        const req = { cookies: { inventoryId: 3 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await inventoryController.fetchUserItems(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            costumes: [{ id: 1, name: "Hat" }]
        });
    });

    // -----------------------------
    // fetchInventoryItems
    // -----------------------------
    test("fetchInventoryItems -> success", async () => {
        const req = { params: { inventoryId: 3 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await inventoryController.fetchInventoryItems(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            items: [{ id: 1 }]
        });
    });

    // -----------------------------
    // fetchItemOnId
    // -----------------------------
    test("fetchItemOnId -> success", async () => {
        const req = { params: { itemId: 1 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await inventoryController.fetchItemOnId(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            item: { id: 1, name: "Shirt" }
        });
    });
});
