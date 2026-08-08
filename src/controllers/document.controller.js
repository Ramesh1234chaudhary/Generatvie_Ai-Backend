const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const AppError = require("../utils/AppError");
const documentService = require("../services/document.service");

const uploadDocument = asyncHandler(async (req, res, next) => {
    try {
        const document = await documentService.uploadDocument(
            req.file,
            req.user,
            req.body.department
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                true,
                "Document uploaded successfully",
                document
            )
        );
    } catch (error) {
        next(error);
    }
});

const getDocuments = asyncHandler(async (req, res, next) => {
    try {
        const documents = await documentService.getDocuments(
            req.user,
            req.query
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "Documents fetched successfully",
                documents
            )
        );
    } catch (error) {
        next(error);
    }
});

const deleteDocument = asyncHandler(async (req, res, next) => {
    try {
        await documentService.deleteDocument(req.params.id);
        return res.status(200).json(
            new ApiResponse(200, true, "Document deleted successfully")
        );
    } catch (error) {
        next(error);
    }
});

const reindexDocument = asyncHandler(async (req, res, next) => {
    try {
        const document = await documentService.reindexDocument(req.params.id);
        return res.status(200).json(
            new ApiResponse(200, true, "Document reindexing completed", document)
        );
    } catch (error) {
        next(error);
    }
});

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
    reindexDocument,
};