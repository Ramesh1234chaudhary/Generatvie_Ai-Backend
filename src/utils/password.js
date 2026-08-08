const bcrypt = require("bcryptjs");

/**
 * Hash plain text password
 */
async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

/**
 * Compare plain password with hashed password
 */
async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
};