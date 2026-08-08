const chatService = require("../services/chat.service");

const askQuestion = async (req, res, next) => {
    try {
        const { question, department } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        let searchDepartment = req.user.department;

        if (req.user.role === "ADMIN" && department) {
            searchDepartment = department;
        } else if (!req.user.department) {
            searchDepartment = department || null;
        }

        const result = await chatService.askQuestion(
            question,
            req.user,
            searchDepartment
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const history = async (req, res, next) => {

    try {

        const chats = await chatService.getChatHistory(
            req.user._id
        );

        res.json({

            success: true,

            data: chats,

        });

    } catch (error) {

        next(error);

    }

};

const clearHistory = async (req, res, next) => {
    try {
        await chatService.clearChatHistory(req.user._id);
        res.json({
            success: true,
            message: "Chat history cleared",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    askQuestion,
    history,
    clearHistory,
};