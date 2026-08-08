const express = require("express");

const router = express.Router();

const { register } = require("../controllers/auth.controller");

const { registerValidator } = require("../validators/auth.validator");
const { login } = require("../controllers/auth.controller");
const { loginValidator } = require("../validators/auth.validator");
const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../middleware/asyncHandler");

const validate = require("../middleware/validate.middleware");

router.post(
    "/register",
    registerValidator,
    validate,
    register
);


router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.post(
    "/refresh",
    asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json(new ApiResponse(400, false, "Refresh token is required"));
        }
        try {
            const jwt = require("jsonwebtoken");
            const userRepository = require("../repositories/user.repository");
            const { generateAccessToken } = require("../utils/jwt");

            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await userRepository.findById(decoded.userId);

            if (!user) {
                return res.status(404).json(new ApiResponse(404, false, "User not found"));
            }

            const newAccessToken = generateAccessToken(user);
            return res.status(200).json(
                new ApiResponse(200, true, "Token refreshed successfully", {
                    accessToken: newAccessToken
                })
            );
        } catch (error) {
            return res.status(401).json(new ApiResponse(401, false, "Invalid or expired refresh token"));
        }
    })
);

module.exports = router;