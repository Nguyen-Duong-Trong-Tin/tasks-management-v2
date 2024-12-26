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
const user_enum_1 = require("../enums/user.enum");
const user_service_1 = __importDefault(require("../services/user.service"));
const forgotPassword_service_1 = __importDefault(require("../services/forgotPassword.service"));
const sendMail_helper_1 = __importDefault(require("../../../helpers/sendMail.helper"));
const generate_helper_1 = __importDefault(require("../../../helpers/generate.helper"));
const md5_util_1 = __importDefault(require("../utils/md5.util"));
const jwt_util_1 = __importDefault(require("../utils/jwt.util"));
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myUserId = req.user.code;
        const userExists = yield user_service_1.default.findById(myUserId);
        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "User id not found."
            });
        }
        return res.status(200).json({
            status: true,
            message: "User found.",
            data: userExists
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fullName = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        const status = req.body.status;
        const userExists = yield user_service_1.default.findByEmail(email);
        if (userExists) {
            return res.status(400).json({
                status: false,
                message: "Email was exists."
            });
        }
        const encodePassword = md5_util_1.default.encodePassword(password);
        const newUser = yield user_service_1.default.register({
            fullName: fullName,
            email: email,
            password: encodePassword,
            role: role,
            status: status
        });
        return res.status(201).json({
            status: true,
            message: "User was created successfully.",
            data: newUser
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Somehing went wrong."
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userExists = yield user_service_1.default.login(email, md5_util_1.default.encodePassword(password));
        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "Email or password were incorrect."
            });
        }
        if (userExists.status === user_enum_1.EUserStatus.INACTIVE) {
            return res.status(400).json({
                status: false,
                message: "This account was inactive."
            });
        }
        const user = {
            code: userExists.id,
            role: userExists.role
        };
        const accessToken = jwt_util_1.default.generateToken(user, "1d");
        const refreshToken = jwt_util_1.default.generateToken(user, "7d");
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        return res.status(200).json({
            status: true,
            message: "Login success.",
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                status: false,
                message: "Refresh token not found."
            });
        }
        const verify = jwt_util_1.default.verifyToken(refreshToken);
        if (verify.expire) {
            return res.status(400).json({
                status: false,
                message: "Refresh token was expire."
            });
        }
        if (!verify.success) {
            res.clearCookie("refreshToken");
            return res.status(400).json({
                status: false,
                message: "Refresh token was incorrect."
            });
        }
        const userId = verify.data.code;
        const userExists = yield user_service_1.default.findById(userId);
        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "User id not found."
            });
        }
        const accessToken = jwt_util_1.default.generateToken({
            code: userExists.id,
            role: userExists.role
        }, "1d");
        return res.status(200).json({
            status: true,
            message: "Refresh token success.",
            data: {
                accessToken: accessToken
            }
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const forgot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const userExists = yield user_service_1.default.findByEmail(email);
        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "User email not found."
            });
        }
        const otp = generate_helper_1.default.generateOtp(6);
        const forgotPasswordExists = yield forgotPassword_service_1.default.findByOtp(otp);
        if (forgotPasswordExists) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong."
            });
        }
        yield forgotPassword_service_1.default.create({
            otp: otp,
            userId: userExists.id
        });
        const title = `Mã OTP Để Khôi Phục Mật Khẩu`;
        const html = `
      <p>
        Đây là mã otp của bạn, không chia sẻ mã này với ai khác.
        <h3>${otp}</h3>
        <p>Mã sẽ hết hạn trong 3 phút.</p>.
      </p>
    `;
        (0, sendMail_helper_1.default)(email, title, html);
        return res.status(200).json({
            status: true,
            message: "OTP was sent to your email."
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const userExists = yield user_service_1.default.findByEmail(email);
        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "User email not found."
            });
        }
        const forgotPasswordExists = yield forgotPassword_service_1.default.findByUserIdAndOtp(userExists.id, otp);
        if (!forgotPasswordExists) {
            return res.status(400).json({
                status: false,
                message: "Email or otp were not found."
            });
        }
        const tokenInfo = {
            code: userExists.id,
            role: userExists.role
        };
        const accessToken = jwt_util_1.default.generateToken(tokenInfo, "1d");
        const refreshToken = jwt_util_1.default.generateToken(tokenInfo, "7d");
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        return res.status(200).json({
            status: true,
            message: "Otp was correct.",
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userExists = yield user_service_1.default.findByEmail(email);
        if (!userExists) {
            return res.status(400).json({
                status: false,
                message: "User email not found."
            });
        }
        const newUser = yield user_service_1.default.update(userExists.id, {
            password: md5_util_1.default.encodePassword(password)
        });
        return res.status(200).json({
            status: true,
            message: "Password was changed successfully.",
            data: newUser
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const userController = {
    me,
    register,
    login,
    refreshToken,
    forgot,
    otp,
    reset
};
exports.default = userController;
