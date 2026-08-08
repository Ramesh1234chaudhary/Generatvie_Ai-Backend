const path = require("path");
const AppError = require("../utils/AppError");
const documentRepository = require("../repositories/document.repository");
const { generateFileHash } = require("../utils/hash");
const { startIndexing, deleteVectors } = require("../services/ai/indexing.service");

const uploadDocument = async (file, user, department = null) => {
    if (!file) {
        throw new AppError("PDF is required", 400);
    }

    const fileHash = await generateFileHash(file.path);

    const existingDocument = await documentRepository.findByHash(fileHash);

    if (existingDocument && existingDocument.department === (department || user.department)) {
        throw new AppError("Document already uploaded for this department", 409);
    }

    const title = path.parse(file.originalname).name;

    const document = await documentRepository.create({
        title,
        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path,
        fileHash,
        uploadedBy: user._id,
        department: department || user.department,
    });

    try {
        await startIndexing(document);
    } catch (error) {
        await documentRepository.deleteById(document._id);
        await deleteVectors(document._id);
        throw new AppError("Document indexing failed. Please try again.", 500);
    }

    return document;
};

const getDocuments = async (user, query) => {
    const filter = {};
    if (query.department) {
        filter.department = query.department;
    } else if (user.role !== "ADMIN") {
        filter.department = user.department;
    }
    return documentRepository.findAll(filter);
};

const deleteDocument = async (documentId) => {
    const deleted = await documentRepository.deleteById(documentId);
    if (!deleted) {
        throw new AppError("Document not found", 404);
    }
    return { id: documentId };
};

const reindexDocument = async (documentId) => {
    const document = await documentRepository.findById(documentId);
    if (!document) {
        throw new AppError("Document not found", 404);
    }
    await startIndexing(document);
    const updated = await documentRepository.findById(documentId);
    return updated;
};

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
    reindexDocument,
};