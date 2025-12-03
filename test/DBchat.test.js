import TradeController from "../controller/TradeController.js";
import supabase from "../supabase.js";


describe("Chat System", () => {

    test("Chat cannot be created for a trade that doesn't exist", async () => {
        const { error } = await supabase
            .from("current_chats")
            .insert([{
                trade_id: 999999,
                active: true
            }]);

        expect(error).not.toBeNull();
    });

    
    
});