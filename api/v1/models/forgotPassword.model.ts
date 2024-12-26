import mongoose from "mongoose";

import { IForgotPasswordFull } from "../interfaces/forgotPassword.interface";

export interface ForgotPasswordDocument extends IForgotPasswordFull, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
};

const ForgotPasswordSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

const ForgotPasswordModel = mongoose.model<ForgotPasswordDocument>("forgotPasswords", ForgotPasswordSchema);
export default ForgotPasswordModel;