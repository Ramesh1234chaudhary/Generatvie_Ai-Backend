const userRepository = require("../repositories/user.repository");
const { hashPassword ,comparePassword} = require("../utils/password");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/jwt");
const AppError = require("../utils/AppError");

const register = async (userData) => {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
        throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(userData.password);

    // If registering via sign-up page (not added by admin), default to ADMIN role
    const role = userData.role || "ADMIN";

    const user = await userRepository.create({
        ...userData,
        role: role,
        password: hashedPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await userRepository.updateRefreshToken(user._id, refreshToken);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
        },
        accessToken,
        refreshToken,
    };
};

const login = async ({ email, password }) => {

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await comparePassword(
        password,
        user.password
    );

    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    await userRepository.updateRefreshToken(
        user._id,
        refreshToken
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        },
        accessToken,
        refreshToken
    };
};

module.exports = {
    register,
    login
};
