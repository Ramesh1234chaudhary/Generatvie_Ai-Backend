const Chat = require("../models/chat.model");

const create = (data) => {
    return Chat.create(data);
};

const getUserHistory = (userId) => {
    return Chat.find({ user: userId })
        .sort({ createdAt: -1 });
};

const deleteUserHistory = (userId) => {
    return Chat.deleteMany({ user: userId });
};

module.exports = {
    create,
    getUserHistory,
    deleteUserHistory,
};