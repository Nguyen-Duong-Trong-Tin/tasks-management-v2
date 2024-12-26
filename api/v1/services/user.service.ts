import { IUserFull } from "../interfaces/user.interface";
import UserModel from "../models/user.model";

const findById = async (id: string) => {
  const userExists = await UserModel
    .findOne({
      _id: id,
      deleted: false
    })
    .select("-password");
  return userExists;
}

const findByEmail = async (email: string) => {
  const userExists = await UserModel
    .findOne({
      email: email,
      deleted: false
    })
    .select("-password");
  return userExists;
}

const login = async (email: string, password: string) => {
  const userExists = await UserModel
    .findOne({
      email: email,
      password: password,
      deleted: false
    })
    .select("-password");
  return userExists;
}

const register = async (user: Partial<IUserFull>) => {
  const newUser = new UserModel(user);
  await newUser.save();
  
  const userExists = await UserModel
    .findOne({
      _id: newUser.id,
      deleted: false
    })
    .select("-password");
  return userExists;
}

const update = async (id: string, user: Partial<IUserFull>) => {
  const newUser = await UserModel.findOneAndUpdate({
    _id: id,
    deleted: false
  }, user, {
    new: true,
    runValidators: true
  });
  return newUser;
}

const userService = {
  findById,
  findByEmail,
  login,
  register,
  update
};
export default userService;