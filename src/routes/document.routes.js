const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
    uploadDocument,
    getDocuments,
    deleteDocument,
    reindexDocument,
} = require("../controllers/document.controller");

router.post(
    "/upload",
    authenticate,
    upload.single("pdf"),
    uploadDocument
);

router.get(
    "/",
    authenticate,
    getDocuments
);

router.delete(
    "/:id",
    authenticate,
    deleteDocument
);

router.post(
    "/:id/reindex",
    authenticate,
    reindexDocument
);

module.exports = router;