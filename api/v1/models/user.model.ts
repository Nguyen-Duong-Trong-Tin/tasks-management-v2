import mongoose from "mongoose";

import { IUserFull } from "../interfaces/user.interface";
import { EUserRole, EUserStatus } from "../enums/user.enum";

export interface UserDocument extends IUserFull, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(EUserRole),
    required: true
  },
  status: {
    type: String,
    enum: EUserStatus,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const UserModel = mongoose.model<UserDocument>("users", UserSchema);
export default UserModel;