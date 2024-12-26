"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateOtp = (length) => {
    const characters = "0123456789";
    const characterLength = characters.length;
    let otp = "";
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * characterLength);
        otp += characters[index];
    }
    return otp;
};
const generate = {
    generateOtp
};
exports.default = generate;
