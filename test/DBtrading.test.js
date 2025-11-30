import supabase from "../supabase.js";
import TradeController from "../controller/TradeController.js";
import inventoryController from "../controller/InventoryController.js";

describe("Trading System", () => {

    test("Cannot create trade offer to yourself", async () => {
        const { error } = await supabase
            .from("trades")
            .insert([{
                user_from: 1,
                user_to: 1
            }]);

        expect(error).not.toBeNull();
    });

    test("Cannot create trade without items", async () => {
        const { data, error } = await supabase
            .from("trades")
            .insert([{
                user_from: 1,
                user_to: 2
            }]);

            // Assuming trades table requires item fields = error
            // Forvent, at der kommer en fejl
        expect(error).not.toBeNull();
        expect(error.code).toBe("23503"); // foreign key violation

        // Cleanup, hvis der af en eller anden grund blev oprettet noget
        await supabase.from('trades').delete().eq('user_from', 1).eq('user_to', 2);
    });

    test("Accepting trade with null itemId should fail", async () => {
        const { error } = await supabase
            .from("trades")
            .update({ status: "accepted" })
            .eq("item_id", null);

        expect(error).not.toBeNull();
    });
});
