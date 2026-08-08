const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../middleware/asyncHandler");

const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            true,
            "User registered successfully",
            result
        )
    );
});

const login = asyncHandler(async (req, res) => {

    const result = await authService.login(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Login successful",
            result
        )
    );
});

module.exports = {
    register,
    login
};


