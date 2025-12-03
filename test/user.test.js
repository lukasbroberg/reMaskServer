import userController from "../controller/UserController.js";
import UserModel from "../model/UserModel.js";
import InventoryModel from "../model/InventoryModel.js";


jest.mock("../model/UserModel.js");
jest.mock("../model/InventoryModel.js");

function mockRes() {
    const res = {};
    res.status = jest.fn().mockImplementation(() => res);
    res.json = jest.fn().mockImplementation(() => res);
    res.cookie = jest.fn().mockImplementation(() => res);
    return res;
}

describe("UserController", () => {

    
    test("signup -> returns 400 if missing email or password", async () => {
        const req = { body: { email: "", password: "" } };
        const res = mockRes();

        await userController.signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email and password are required"
        });
    });

    test("signup -> success response", async () => {
        const req = {
            body: {
                email: "test@test.com",
                password: "1234",
                firstName: "Marco",
                lastName: "M",
                studie: "IT"
            }
        };

        const mockUser = { id: 1, firstName: "Marco" };

        UserModel.mockImplementation(() => ({
            authUserSignUp: jest.fn().mockResolvedValue({ user: { id: 123 }}),
            insertNewUserOnUserTable: jest.fn().mockResolvedValue(mockUser)
        }));

        const res = mockRes();

        await userController.signup(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: "User signed up successfully",
            user: mockUser
        });
    });

    test("signup -> supabase error", async () => {
        const req = {
            body: {
                email: "fail@test.com",
                password: "1234",
                firstName: "Marco",
                lastName: "M",
                studie: "IT"
            }
        };

        UserModel.mockImplementation(() => ({
            authUserSignUp: jest.fn().mockRejectedValue(new Error("signup failed"))
        }));

        const res = mockRes();
        await userController.signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "signup failed" });
    });



    test("login -> returns 400 if missing email or password", async () => {
        const req = { body: { email: "", password: "" } };
        const res = mockRes();

        await userController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email and password are required"
        });
    });

    test("login -> success", async () => {
        const req = {
            body: { email: "a@a.com", password: "1234" }
        };

        UserModel.mockImplementation(() => ({
            authUserLogin: jest.fn().mockResolvedValue({
                user: { id: "uuid" },
                session: { access_token: "token123" }
            }),
            getUserFromAuthUUID: jest.fn().mockResolvedValue([
                { id: 10, firstName: "Marco", lastName: "M", studie: "IT" }
            ])
        }));

        InventoryModel.mockImplementation(() => ({
            selectInventoryIdFromUserId: jest.fn().mockResolvedValue({ id: 99 })
        }));

        const res = mockRes();

        await userController.login(req, res);

        // Check cookies
        expect(res.cookie).toHaveBeenCalledWith("sb_access_token", "token123", expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("userId", 10, expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("inventoryId", 99, expect.any(Object));

        // Check JSON response
        expect(res.json).toHaveBeenCalledWith({
            message: "User logged in successfully",
            user: {
                id: 10,
                firstName: "Marco",
                lastName: "M",
                studie: "IT"
            }
        });
    });

    test("login -> supabase error", async () => {
        const req = { body: { email: "a@a.com", password: "wrong" } };

        UserModel.mockImplementation(() => ({
            authUserLogin: jest.fn().mockRejectedValue(new Error("login failed"))
        }));

        const res = mockRes();
        await userController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "login failed" });
    });

    test("getCurrentUser -> returns 401 if no cookie", async () => {
        const req = { cookies: {} };
        const res = mockRes();

        await userController.getCurrentUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "no session" });
    });

    test("getCurrentUser -> success", async () => {
        const req = { cookies: { sb_access_token: "token123" } };

        UserModel.mockImplementation(() => ({
            getCurrentUser: jest.fn().mockResolvedValue({ user: { id: "uuid" }}),
            getUserFromAuthUUID: jest.fn().mockResolvedValue([
                { id: 10, firstName: "Marco", lastName: "M", studie: "IT" }
            ])
        }));

        const res = mockRes();

        await userController.getCurrentUser(req, res);

        expect(res.cookie).toHaveBeenCalledWith("sb_access_token", "token123", expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("userId", 10, expect.any(Object));

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            user: {
                id: 10,
                firstName: "Marco",
                lastName: "M",
                studie: "IT"
            }
        });
    });

    test("getCurrentUser -> supabase fails", async () => {
        const req = { cookies: { sb_access_token: "token" } };

        UserModel.mockImplementation(() => ({
            getCurrentUser: jest.fn().mockRejectedValue(new Error("fail"))
        }));

        const res = mockRes();
        await userController.getCurrentUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "unable to authorize user" });
    });

});
