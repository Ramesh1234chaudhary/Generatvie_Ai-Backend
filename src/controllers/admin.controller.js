const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const AppError = require("../utils/AppError");
const { body, validationResult } = require("express-validator");

const authService = require("../services/auth.service");
const userRepository = require("../repositories/user.repository");
const documentRepository = require("../repositories/document.repository");

const { USER_ROLES, USER_DEPARTMENTS } = require("../models/user.model");

const dashboard = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Welcome Admin",
            req.user
        )
    );
});

const generateCredentials = (name, phone) => {
    // name's first 3 letters with @ and last 4 digits of phone number
    const namePart = name.replace(/\s+/g, "").substring(0, 3).toLowerCase();
    const cleanPhone = phone.toString().replace(/[^0-9]/g, "");
    const phoneLast4 = cleanPhone.slice(-4);
    const email = `${namePart}@${phoneLast4}.com`;
    const password = `${namePart}@${phoneLast4}`;
    return { email, password };
};

const createEmployeeValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("department")
        .isIn(Object.values(USER_DEPARTMENTS))
        .withMessage("Invalid department"),
];

const createEmployee = asyncHandler(async (req, res, next) => {
    const validate = createEmployeeValidator;
    for (const rule of validate) {
        await rule.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(errors.array()[0].msg, 400));
    }

    const { name, phone, department } = req.body;
    const { email, password } = generateCredentials(name, phone);

    try {
        const result = await authService.register({
            name,
            email,
            password,
            role: USER_ROLES.EMPLOYEE,
            department,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                true,
                "Employee created successfully with auto-generated credentials",
                {
                    user: result.user,
                    credentials: { email, password },
                }
            )
        );
    } catch (error) {
        if (error.statusCode === 409) {
            return next(new AppError("Employee already exists", 409));
        }
        return next(error);
    }
});

const getEmployees = asyncHandler(async (req, res) => {
    const employees = await userRepository.findByRole(USER_ROLES.EMPLOYEE);
    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Employees fetched successfully",
            employees
        )
    );
});

const deleteEmployee = asyncHandler(async (req, res, next) => {
    const Document = require("../models/document.model");
    await Document.deleteMany({ uploadedBy: req.params.id });
    const deleted = await userRepository.deleteById(req.params.id);
    if (!deleted) {
        return next(new AppError("Employee not found", 404));
    }
    return res.status(200).json(
        new ApiResponse(200, true, "Employee deleted successfully")
    );
});

const getAllDocuments = asyncHandler(async (req, res) => {
    const documents = await documentRepository.findAll();
    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Documents fetched successfully",
            documents
        )
    );
});

const deleteDocument = asyncHandler(async (req, res, next) => {
    const deleted = await documentRepository.deleteById(req.params.id);
    if (!deleted) {
        return next(new AppError("Document not found", 404));
    }
    return res.status(200).json(
        new ApiResponse(200, true, "Document deleted successfully")
    );
});

const reindexDocument = asyncHandler(async (req, res, next) => {
    const document = await documentRepository.findById(req.params.id);
    if (!document) {
        return next(new AppError("Document not found", 404));
    }
    const { startIndexing } = require("../services/ai/indexing.service");
    await startIndexing(document);
    const updated = await documentRepository.findById(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, true, "Document reindexing completed", updated)
    );
});

module.exports = {
    dashboard,
    createEmployee,
    getEmployees,
    deleteEmployee,
    getAllDocuments,
    deleteDocument,
    reindexDocument,
};