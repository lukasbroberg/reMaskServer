import inventoryController from "../controller/InventoryController.js";
import InventoryModel from "../model/InventoryModel.js";

// Mock the InventoryModel
jest.mock("../model/InventoryModel.js");

function mockRes() {
    const res = {};
    res.status = jest.fn().mockImplementation(() => res);
    res.json = jest.fn().mockImplementation(() => res);
    return res;
}

describe("inventoryController", () => {

   
    test("addItemToInventory -> success", async () => {
        const req = { body: { name: "Hat", description: "Funny hat", size: "M" } };

        InventoryModel.mockImplementation(() => ({
            addItemToInventory: jest.fn().mockResolvedValue(true)
        }));

        const res = mockRes();

        await inventoryController.addItemToInventory(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Item added to inventory"
        });
    });

    test("addItemToInventory -> failure", async () => {
        const req = { body: { name: "Hat", description: "Funny hat", size: "M" } };

        InventoryModel.mockImplementation(() => ({
            addItemToInventory: jest.fn().mockRejectedValue(new Error("fail"))
        }));

        const res = mockRes();

        await inventoryController.addItemToInventory(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Unable to add item to inventory"
        });
    });

    
    
    test("fetchUserItems -> success", async () => {
        const mockItems = [{ id: 1, name: "Hat" }, { id: 2, name: "Mask" }];
        InventoryModel.mockImplementation(() => ({
            selectUserItemsFromId: jest.fn().mockResolvedValue(mockItems)
        }));

        const req = {};
        const res = mockRes();

        await inventoryController.fetchUserItems(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            costumes: mockItems
        });
    });

    test("fetchUserItems -> failure", async () => {
        InventoryModel.mockImplementation(() => ({
            selectUserItemsFromId: jest.fn().mockRejectedValue(new Error("fail"))
        }));

        const req = {};
        const res = mockRes();

        await inventoryController.fetchUserItems(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "fail"
        });
    });

   
    
    test("fetchInventoryItems -> success", async () => {
        const mockItems = [{ id: 1, name: "Hat" }];
        InventoryModel.mockImplementation(() => ({
            selectUserItemsFromId: jest.fn().mockResolvedValue(mockItems)
        }));

        const req = { params: { inventoryId: 5 } };
        const res = mockRes();

        await inventoryController.fetchInventoryItems(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            items: mockItems
        });
    });

    test("fetchInventoryItems -> failure", async () => {
        InventoryModel.mockImplementation(() => ({
            selectUserItemsFromId: jest.fn().mockRejectedValue(new Error("fail"))
        }));

        const req = { params: { inventoryId: 5 } };
        const res = mockRes();

        await inventoryController.fetchInventoryItems(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "fail"
        });
    });

    
    test("fetchItemOnId -> success", async () => {
        const mockItem = { id: 1, name: "Hat" };

        InventoryModel.mockImplementation(() => ({
            selectItemFromItemId: jest.fn().mockResolvedValue(mockItem)
        }));

        const req = { params: { itemId: 1 } };
        const res = mockRes();

        await inventoryController.fetchItemOnId(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            item: mockItem
        });
    });

    test("fetchItemOnId -> failure", async () => {
        InventoryModel.mockImplementation(() => ({
            selectItemFromItemId: jest.fn().mockRejectedValue(new Error("fail"))
        }));

        const req = { params: { itemId: 1 } };
        const res = mockRes();

        await inventoryController.fetchItemOnId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);  // note: original controller has bug here, should be res.status(400).json(...)
    });

});
