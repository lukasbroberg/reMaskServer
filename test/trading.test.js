import TradeController from "../controller/TradeController.js";
import TradeModel from "../model/TradeModel.js";
import InventoryModel from "../model/InventoryModel.js";

jest.mock("../model/TradeModel.js");
jest.mock("../model/InventoryModel.js");

const mockRes = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    return { json, status };
};

beforeEach(() => {
    jest.clearAllMocks();
});

test("acceptOffer returns 400 when trade does not exist", async () => {
    TradeModel.mockImplementation(() => ({
        acceptTrade: jest.fn().mockResolvedValue(null)
    }));

    const res = mockRes();

    const req = {
        cookies: { userId: 1 },
        params: { tradeId: 999999 }
    };

    await TradeController.acceptOffer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});

test("declineOffer returns success when declineTrade resolves", async () => {
    TradeModel.mockImplementation(() => ({
        declineTrade: jest.fn().mockResolvedValue(true)
    }));

    const res = mockRes();

    const req = {
        params: { tradeId: 55 }
    };

    await TradeController.declineOffer(req, res);

    expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "declined trade offer"
    });
});

test("deleteOffer returns success when deleteTrade resolves", async () => {
    TradeModel.mockImplementation(() => ({
        deleteTrade: jest.fn().mockResolvedValue(true)
    }));

    const res = mockRes();

    const req = {
        params: { tradeId: 10 }
    };

    await TradeController.deleteOffer(req, res);

    expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "trade offer deleted"
    });
});

test("getInboundOffersFromUserId returns inbound trades", async () => {
    const mockData = [{ id: 1 }, { id: 2 }];

    TradeModel.mockImplementation(() => ({
        selectInboundFromUserId: jest.fn().mockResolvedValue(mockData)
    }));

    const res = mockRes();

    const req = {
        cookies: { userId: 4 }
    };

    await TradeController.getInboundOffersFromUserId(req, res);

    expect(res.json).toHaveBeenCalledWith({
        success: true,
        inboundTrades: mockData
    });
});

test("getOutboundOffersFromUserId returns outbound trades", async () => {
    const mockData = [{ id: 5 }, { id: 6 }];

    TradeModel.mockImplementation(() => ({
        selectOutboundFromUserId: jest.fn().mockResolvedValue(mockData)
    }));

    const res = mockRes();

    const req = {
        cookies: { userId: 7 }
    };

    await TradeController.getOutboundOffersFromUserId(req, res);

    expect(res.json).toHaveBeenCalledWith({
        success: true,
        outboundTrades: mockData
    });
});

test("confirmReceivedTrades returns success when insertOnTradeReceived resolves", async () => {
    TradeModel.mockImplementation(() => ({
        insertOnTradeReceived: jest.fn().mockResolvedValue(true)
    }));

    const res = mockRes();

    const req = {
        cookies: { userId: 1 },
        params: { tradeId: 22 }
    };

    await TradeController.confirmReceivedTrades(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true });
});

test("getConfirmedTrades returns confirmed trades", async () => {
    const mockResult = [{ id: 9 }];

    TradeModel.mockImplementation(() => ({
        selectTradeItemsReceived: jest.fn().mockResolvedValue(mockResult)
    }));

    const res = mockRes();

    const req = {
        cookies: { userId: 1 }
    };

    await TradeController.getConfirmedTrades(req, res);

    expect(res.json).toHaveBeenCalledWith({
        success: true,
        confirmedTrades: mockResult
    });
});
