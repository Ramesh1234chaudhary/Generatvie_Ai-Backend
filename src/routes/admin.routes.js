const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const {
    dashboard,
    createEmployee,
    getEmployees,
    deleteEmployee,
    getAllDocuments,
    deleteDocument,
    reindexDocument,
} = require("../controllers/admin.controller");

router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    dashboard
);

router.post(
    "/employees",
    authenticate,
    authorize("ADMIN"),
    createEmployee
);

router.get(
    "/employees",
    authenticate,
    authorize("ADMIN"),
    getEmployees
);

router.delete(
    "/employees/:id",
    authenticate,
    authorize("ADMIN"),
    deleteEmployee
);

router.get(
    "/documents",
    authenticate,
    authorize("ADMIN"),
    getAllDocuments
);

router.delete(
    "/documents/:id",
    authenticate,
    authorize("ADMIN"),
    deleteDocument
);

router.post(
    "/documents/:id/reindex",
    authenticate,
    authorize("ADMIN"),
    reindexDocument
);

module.exports = router;