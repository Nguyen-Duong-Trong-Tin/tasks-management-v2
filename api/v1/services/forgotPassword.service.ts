import { IForgotPasswordFull } from "../interfaces/forgotPassword.interface";
import ForgotPasswordModel from "../models/forgotPassword.model";

const findByOtp = async (otp: string) => {
  const forgotPasswordExists = await ForgotPasswordModel.findOne({
    otp: otp
  });
  return forgotPasswordExists;
}

const findByUserIdAndOtp = async (userId: string, otp: string) => {
  const fongotPasswordExists = await ForgotPasswordModel.findOne({
    userId: userId,
    otp: otp
  });
  return fongotPasswordExists;
}

const create = async (forgotPassword: Partial<IForgotPasswordFull>) => {
  const newForgotPassword = new ForgotPasswordModel({
    ...forgotPassword,
    createdAt: Date.now()
  });
  await newForgotPassword.save();
  return newForgotPassword;
}

const forgotPasswordService = {
  findByOtp,
  findByUserIdAndOtp,
  create
};
export default forgotPasswordService;