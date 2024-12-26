"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_util_1 = __importDefault(require("../utils/jwt.util"));
const response401 = (res) => {
    return res.status(401).json({
        status: false,
        message: "Authenrization unsucess."
    });
};
const deserializeUser = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return response401(res);
        }
        const authorizationArray = authorization.split(" ");
        if (authorizationArray.length !== 2) {
            return response401(res);
        }
        const bearer = authorizationArray[0];
        if (bearer !== "Bearer") {
            return response401(res);
        }
        const accessToken = authorizationArray[1];
        const verify = jwt_util_1.default.verifyToken(accessToken);
        if (verify.expire) {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return response401(res);
            }
            const verifyRefreshToken = jwt_util_1.default.verifyToken(refreshToken);
            if (!verifyRefreshToken.success) {
                res.clearCookie("refreshToken");
                return response401(res);
            }
            return res.status(401).json({
                status: false,
                message: "Access token was expire."
            });
        }
        if (!verify.success) {
            return response401(res);
        }
        req.user = verify.data;
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
exports.default = deserializeUser;
