const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    sources: [
        {
            source: String,
            page: Number,
        }
    ],
}, {
    timestamps: true,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
