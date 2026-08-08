const mongoose = require("mongoose");

const USER_ROLES = {
    ADMIN: "ADMIN",
    HR: "HR",
    EMPLOYEE: "EMPLOYEE"
};

const USER_DEPARTMENTS = {
    HR: "HR",
    FINANCE: "FINANCE",
    IT: "IT",
    LEGAL: "LEGAL",
    ADMIN: "ADMIN",
    ENGINEERING: "ENGINEERING",
    SALES: "SALES",
    OPERATIONS: "OPERATIONS"
};

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.EMPLOYEE
        },

        department: {
            type: String,
            enum: Object.values(USER_DEPARTMENTS),
            required: function() {
                return this.role !== USER_ROLES.ADMIN;
            }
        },

        isActive: {
            type: Boolean,
            default: true
        },

        refreshToken: {
            type: String,
            default: null,
            select: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    USER_ROLES,
    USER_DEPARTMENTS
};