import supabase from "../supabase.js";

describe("DB Rating", () => {

    test("Cannot rate non-existent user", async () => {
        const { error } = await supabase
            .from("user_ratings")
            .insert([{ trade_id: 1, from_user: 1, to_user: -1, rating: 4 }]);

        expect(error).not.toBeNull();
    });

    test("Cannot rate above 5 or below 1", async () => {
        const invalid = [-1, 0, 6, 10];

        for (const r of invalid) {
            const { error } = await supabase
                .from("user_ratings")
                .insert([{ trade_id: 1, from_user: 1, to_user: 2, rating: r }]);

            expect(error).not.toBeNull();
        }
    });

    test("Half ratings not allowed", async () => {
        const { error } = await supabase
            .from("user_ratings")
            .insert([{ trade_id: 1, from_user: 1, to_user: 2, rating: 0.5 }]);

        expect(error).not.toBeNull();
    });

});
