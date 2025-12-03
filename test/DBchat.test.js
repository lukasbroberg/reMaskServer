import supabase from "../supabase.js";

describe("DB Chat", () => {

    test("Chat cannot be created if trade doesn't exist", async () => {
        const { error } = await supabase
            .from("current_chats")
            .insert([{ trade_id: 999999, active: true }]);

        expect(error).not.toBeNull();
    });

});
