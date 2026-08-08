const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const userRepository = require("../repositories/user.repository");

const authenticate = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Access token missing", 401));
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userRepository.findById(decoded.userId);

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        req.user = user;

        next();

    } catch (error) {
        next(new AppError("Invalid or expired token", 401));
    }
};

module.exports = authenticate;