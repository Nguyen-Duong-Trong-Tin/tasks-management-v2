import { IUserFull } from "../interfaces/user.interface";
import UserModel from "../models/user.model";

const findById = async (id: string) => {
  const userExists = await UserModel.findOne({
    _id: id,
    deleted: false
  });
  return userExists;
}

const findByEmail = async (email: string) => {
  const userExists = await UserModel.findOne({
    email: email,
    deleted: false
  });
  return userExists;
}

const login = async (email: string, password: string) => {
  const userExists = await UserModel.findOne({
    email: email,
    password: password,
    deleted: false
  });
  return userExists;
}

const register = async (user: Partial<IUserFull>) => {
  const newUser = new UserModel(user);
  await newUser.save();
  return newUser;
}

const userService = {
  findById,
  findByEmail,
  login,
  register
};
export default userService;