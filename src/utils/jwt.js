const jwt = require("jsonwebtoken");

/**
 * Generate Access Token
 */
function generateAccessToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
            department: user.department
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );
}

/**
 * Generate Refresh Token
 */
function generateRefreshToken(user) {
    return jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
};