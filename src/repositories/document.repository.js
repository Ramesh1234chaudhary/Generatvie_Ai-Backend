const Document = require("../models/document.model");

const create = async (data) => {
    return Document.create(data);
};

const findByHash = async (fileHash) => {
    return Document.findOne({ fileHash });
};

const findById = async (id) => {
    return Document.findById(id);
};

const findAll = async (filter = {}) => {
    return Document.find(filter)
        .sort({ createdAt: -1 })
        .populate("uploadedBy", "name email role department");
};

const updateStatus = async (id, status) => {
    return await Document.findByIdAndUpdate(
        id,
        { status },
        { returnDocument: 'after' }
    );
};

const deleteById = async (id) => {
    const result = await Document.findByIdAndDelete(id);
    return result;
};

module.exports = {
    create,
    findByHash,
    findById,
    findAll,
    updateStatus,
    deleteById,
};