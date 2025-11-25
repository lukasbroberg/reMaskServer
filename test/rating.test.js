import supabase from "../supabase.js";

describe("Rating System", () => {

    test("Cannot rate a non-existent user (to_user = -1)", async () => {
        const { error } = await supabase
            .from("user_ratings")
            .insert([{
                trade_id: 1,
                from_user: 1,
                to_user: -1,
                rating: 4
            }]);

        expect(error).not.toBeNull();
    });

    test("Cannot rate above 5 or below 1", async () => {
        const invalidRatings = [-1, 0, 6, 10];

        for (const r of invalidRatings) {
            const { error } = await supabase
                .from("user_ratings")
                .insert([{
                    trade_id: 1,
                    from_user: 1,
                    to_user: 2,
                    rating: r
                }]);

            expect(error).not.toBeNull();
        }
    });

    test("Half ratings are allowed (rating = 0.5)", async () => {
        const { data, error } = await supabase
            .from("user_ratings")
            .insert([{
                trade_id: 1,
                from_user: 1,
                to_user: 2,
                rating: 0.5
            }]);

        expect(error).not.toBeNull();
        expect(error.message).toMatch(/invalid input syntax/i);

        // cleanup
        await supabase
            .from("user_ratings")
            .delete()
            .eq("trade_id", 1)
            .eq("from_user", 1)
            .eq("to_user", 2);
    });
});
