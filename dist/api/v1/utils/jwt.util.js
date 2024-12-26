"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const generateToken = (user, expiresIn) => {
    return jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: expiresIn
    });
};
const verifyToken = (token) => {
    const verify = {
        success: false,
        expire: false,
        data: {}
    };
    const handleVerify = (e, user) => {
        if (e) {
            const errorName = e.name;
            if (errorName === "TokenExpiredError") {
                verify.expire = true;
            }
            return;
        }
        verify.success = true;
        verify.data = user;
        return;
    };
    jwt.verify(token, process.env.TOKEN_SECRET, handleVerify);
    return verify;
};
const jwtUtil = {
    generateToken,
    verifyToken
};
exports.default = jwtUtil;
