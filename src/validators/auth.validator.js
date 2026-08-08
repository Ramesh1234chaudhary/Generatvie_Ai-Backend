const { body } = require("express-validator");

const registerValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),

    body("email").isEmail().withMessage("Invalid email"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body("department")
        .optional()
];

const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

module.exports = {
    registerValidator,
    loginValidator
};