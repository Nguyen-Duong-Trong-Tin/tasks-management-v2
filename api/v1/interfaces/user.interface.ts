import { EUserRole, EUserStatus } from "../enums/user.enum";

interface IUserFull {
  code: string;
  fullName: string;
  email: string;
  password: string;
  role: EUserRole;
  status: EUserStatus;
  deleted: boolean;
  deletedAt: Date;
};

export {
  IUserFull
};