const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const { history, askQuestion, clearHistory } = require("../controllers/chat.controller");

router.post(
    "/ask",
    authenticate,
    askQuestion
);

router.get(
    "/history",
    authenticate,
    history
);

router.delete(
    "/history",
    authenticate,
    clearHistory
);

module.exports = router;