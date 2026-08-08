const AppError = require("../utils/AppError");

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("You are not authorized", 403)
            );
        }

        next();
    };
};

module.exports = authorize;