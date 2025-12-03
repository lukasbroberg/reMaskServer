import supabase from "../supabase.js";

describe("DB Trading", () => {

    test("Cannot create trade offer to yourself", async () => {
        const { error } = await supabase
            .from("trades")
            .insert([{ user_from: 1, user_to: 1 }]);

        expect(error).not.toBeNull();
    });

    test("Cannot create trade without items", async () => {
        const { error } = await supabase
            .from("trades")
            .insert([{ user_from: 1, user_to: 2 }]);

        expect(error).not.toBeNull();
    });

    test("Accepting trade with null itemId should fail", async () => {
        const { error } = await supabase
            .from("trades")
            .update({ status: "accepted" })
            .eq("item_id", null);

        expect(error).not.toBeNull();
    });

});
