const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        fileName: {
            type: String,
            required: true,
        },

        filePath: {
            type: String,
            required: true,
        },

        fileHash: {
            type: String,
            required: true,
            unique: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        department: {
            type: String,
            required: true,
        },

status: {
    type: String,
    enum: ["UPLOADED", "INDEXING", "INDEXED", "FAILED"],
    default: "UPLOADED",
},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Document", documentSchema);