"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
const ForgotPasswordSchema = new mongoose_1.default.Schema({
    otp: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        expires: 180
    }
}, {
    timestamps: true
});
const ForgotPasswordModel = mongoose_1.default.model("forgotPasswords", ForgotPasswordSchema);
exports.default = ForgotPasswordModel;
