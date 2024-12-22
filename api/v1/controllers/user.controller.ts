import { Request, Response } from "express";

import { EUserStatus } from "../enums/user.enum";

import { IUserFull } from "../interfaces/user.interface";

import userService from "../services/user.service";

import md5Util from "../utils/md5.util";
import jwtUtil from "../utils/jwt.util";

// [POST] /api/v1/users/register
const register = async (req: Request, res: Response) => {
  try {
    const fullName = req.body.full_name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const status = req.body.status;

    const userExists = await userService.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        status: false,
        message: "Email was exists."
      });
    }

    const encodePassword = md5Util.encodePassword(password);

    const newUser = await userService.register({
      fullName: fullName,
      email: email,
      password: encodePassword,
      role: role,
      status: status
    });
    return res.status(201).json({
      status: true,
      message: "User was created successfully.",
      data: newUser
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Somehing went wrong."
    });
  }
}

// [POST] /api/v1/users/login
const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userExists = await userService.login(email, md5Util.encodePassword(password));
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "Email or password were incorrect."
      });
    }

    if (userExists.status === EUserStatus.INACTIVE) {
      return res.status(400).json({
        status: false,
        message: "This account was inactive."
      });
    }

    const user: Partial<IUserFull> = {
      code: userExists.id,
      role: userExists.role
    };
    const accessToken = jwtUtil.generateToken(user, "1d");
    const refreshToken = jwtUtil.generateToken(user, "7d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({
      status: true,
      message: "Login success.",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/refresh-token
const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        status: false,
        message: "Refresh token not found."
      });
    }

    const verify = jwtUtil.verifyToken(refreshToken);
    if (verify.expire) {
      return res.status(400).json({
        status: false,
        message: "Refresh token was expire."
      });
    }

    if (!verify.success) {
      res.clearCookie("refreshToken");
      return res.status(400).json({
        status: false,
        message: "Refresh token was incorrect."
      });
    }

    const userId = verify.data.code as string;
    const userExists = await userService.findById(userId);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User id not found."
      });
    }

    const accessToken = jwtUtil.generateToken({
      code: userExists.id,
      role: userExists.role
    }, "1d");
    return res.status(200).json({
      status: true,
      message: "Refresh token success.",
      data: {
        accessToken: accessToken
      }
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const userController = {
  register,
  login,
  refreshToken
};
export default userController;