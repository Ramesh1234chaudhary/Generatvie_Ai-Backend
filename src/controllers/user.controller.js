const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getProfile = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Profile fetched successfully",
            req.user
        )
    );

});

module.exports = {
    getProfile
};