import { UserDocument } from "../models/user.model";

interface IForgotPassword {
  otp: string;
};

interface IForgotPasswordFull extends IForgotPassword {
  userId: UserDocument["_id"]
};

export { IForgotPassword, IForgotPasswordFull };