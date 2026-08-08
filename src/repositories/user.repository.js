const { User } = require("../models/user.model");

class UserRepository {
    async create(userData) {
        return User.create(userData);
    }

    async findByEmail(email) {
        return User.findOne({ email }).select("+password +refreshToken");
    }

    async findById(id) {
        return User.findById(id).select("-password -refreshToken");
    }

    async findByRole(role) {
        return User.find({ role, isActive: true })
            .select("-password -refreshToken")
            .sort({ createdAt: -1 });
    }

    async deleteById(id) {
        const result = await User.findByIdAndDelete(id);
        return result;
    }

    async updateRefreshToken(userId, refreshToken) {
        return User.findByIdAndUpdate(
            userId,
            { refreshToken },
            { new: true }
        );
    }

    async clearRefreshToken(userId) {
        return User.findByIdAndUpdate(
            userId,
            { refreshToken: null },
            { new: true }
        );
    }
}

module.exports = new UserRepository();