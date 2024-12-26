"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("md5");
const encodePassword = (password) => {
    const newPassword = md5(password);
    return newPassword;
};
const md5Util = {
    encodePassword
};
exports.default = md5Util;
