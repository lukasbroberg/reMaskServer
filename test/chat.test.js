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

    test("Chat cannot start before trade exists", async () => {
        const { error } = await supabase
            .from("current_chats")
            .insert([{
                trade_id: 888888,
                active: true
            }]);

        expect(error).not.toBeNull();
    });
});