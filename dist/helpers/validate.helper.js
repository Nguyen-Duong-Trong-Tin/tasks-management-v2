"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateEmail = (email) => {
    return email
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
const validatePassword = (password) => {
    return password
        .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
};
const validateDate = (date) => {
    return !isNaN(date.getTime());
};
const validateOtp = (otp) => {
    const length = otp.length;
    if (length !== 6) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        if (otp[i] < '0' || otp[i] > '9') {
            return false;
        }
    }
    return true;
};
const validateHelper = {
    validateEmail,
    validatePassword,
    validateDate,
    validateOtp
};
exports.default = validateHelper;
