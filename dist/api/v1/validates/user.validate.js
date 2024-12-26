"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_helper_1 = __importDefault(require("../../../helpers/validate.helper"));
const user_enum_1 = require("../enums/user.enum");
const register = (req, res, next) => {
    try {
        const fullName = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        const status = req.body.status;
        if (fullName === undefined ||
            email === undefined ||
            password === undefined ||
            role === undefined ||
            status === undefined) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if (typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof role !== "string" ||
            typeof status !== "string") {
            return res.status(400).json({
                status: false,
                message: "Missing datatype."
            });
        }
        if (!validate_helper_1.default.validateEmail(email)) {
            return res.status(400).json({
                status: false,
                message: "Email was incorrect."
            });
        }
        if (!validate_helper_1.default.validatePassword(password)) {
            return res.status(400).json({
                status: false,
                message: "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
            });
        }
        if (!Object.values(user_enum_1.EUserRole).includes(role)) {
            return res.status(400).json({
                status: false,
                message: "Role was incorrect."
            });
        }
        if (!Object.values(user_enum_1.EUserStatus).includes(status)) {
            return res.status(400).json({
                status: false,
                message: "Status was incorrect."
            });
        }
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
const login = (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email === undefined ||
            password === undefined) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                status: false,
                message: "Missing datatype."
            });
        }
        if (!validate_helper_1.default.validateEmail(email)) {
            return res.status(400).json({
                status: false,
                message: "Email was incorrect."
            });
        }
        if (!validate_helper_1.default.validatePassword(password)) {
            return res.status(400).json({
                status: false,
                message: "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
            });
        }
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
const forgot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if (typeof email !== "string") {
            return res.status(400).json({
                status: false,
                message: "Missing datatype."
            });
        }
        if (!validate_helper_1.default.validateEmail(email)) {
            return res.status(400).json({
                status: false,
                message: "Email was incorrect."
            });
        }
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const otp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        if (!email ||
            !otp) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if (typeof email !== "string" ||
            typeof otp !== "string") {
            return res.status(400).json({
                status: false,
                message: "Missing datatype."
            });
        }
        if (!validate_helper_1.default.validateEmail(email)) {
            return res.status(400).json({
                status: false,
                message: "Email was incorrect."
            });
        }
        if (!validate_helper_1.default.validateOtp(otp)) {
            return res.status(400).json({
                status: false,
                message: "Otp was incorrect."
            });
        }
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const reset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (!email ||
            !password ||
            !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if (typeof email !== "string" ||
            typeof password !== "string" ||
            typeof confirmPassword !== "string") {
            return res.status(400).json({
                status: false,
                message: "Missing datatype."
            });
        }
        if (!validate_helper_1.default.validateEmail(email)) {
            return res.status(400).json({
                status: false,
                message: "Email was incorrect."
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Password must be equal confirm password."
            });
        }
        if (!validate_helper_1.default.validatePassword(password)) {
            return res.status(400).json({
                status: false,
                message: "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
            });
        }
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const userValidate = {
    register,
    login,
    forgot,
    otp,
    reset
};
exports.default = userValidate;
