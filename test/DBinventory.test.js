import supabase from "../supabase.js";

describe("DB Inventory", () => {

    test("Cannot insert empty item (null fields)", async () => {
        const { error } = await supabase
            .from("items")
            .insert([{ name: null, description: null, size: null, user_id: 1 }]);

        expect(error).not.toBeNull();
    });

    test("Cannot insert empty strings", async () => {
        const { error } = await supabase
            .from("items")
            .insert([{ name: "", description: "", size: "", user_id: 1 }]);

        expect(error).not.toBeNull();
    });

});
