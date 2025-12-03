import TradeController from "../controller/TradeController.js";

jest.mock("../model/TradeModel.js", () => {
    return jest.fn().mockImplementation(() => ({
        declineTrade: jest.fn().mockResolvedValue(true),
        deleteTrade: jest.fn().mockResolvedValue(true)
    }));
});

describe("Trade Controller", () => {

    beforeEach(() => jest.clearAllMocks());

    // -----------------------------
    // declineOffer
    // -----------------------------
    test("declineOffer -> success", async () => {
        const req = { params: { tradeId: 1 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await TradeController.declineOffer(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "declined trade offer"
        });
    });

    // -----------------------------
    // deleteOffer
    // -----------------------------
    test("deleteOffer -> success", async () => {
        const req = { params: { tradeId: 1 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await TradeController.deleteOffer(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "trade offer deleted"
        });
    });

});
