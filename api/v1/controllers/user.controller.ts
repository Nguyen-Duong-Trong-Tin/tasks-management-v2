import { Request, Response } from "express";

import { EUserStatus } from "../enums/user.enum";

import { IUserFull } from "../interfaces/user.interface";

import userService from "../services/user.service";
import forgotPasswordService from "../services/forgotPassword.service";

import sendMailHelper from "../../../helpers/sendMail.helper";
import generate from "../../../helpers/generate.helper";

import md5Util from "../utils/md5.util";
import jwtUtil from "../utils/jwt.util";

// [GET] /api/v1/users/me
const me = async (req: any, res: Response) => {
  try {
    const myUserId = req.user.code;

    const userExists = await userService.findById(myUserId);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User id not found."
      });
    }
    return res.status(200).json({
      status: true,
      message: "User found.",
      data: userExists
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/register
const register = async (req: Request, res: Response) => {
  try {
    const fullName = req.body.fullname;
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
      maxAge: 1000 * 60 * 60 * 24 * 7
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

// [POST] /api/v1/users/password/forgot
const forgot = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    const userExists = await userService.findByEmail(email);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User email not found."
      });
    }

    const otp = generate.generateOtp(6);
    const forgotPasswordExists = await forgotPasswordService.findByOtp(otp);
    if (forgotPasswordExists) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
    await forgotPasswordService.create({
      otp: otp,
      userId: userExists.id
    });

    const title = `Mã OTP Để Khôi Phục Mật Khẩu`;
    const html = `
      <p>
        Đây là mã otp của bạn, không chia sẻ mã này với ai khác.
        <h3>${otp}</h3>
        <p>Mã sẽ hết hạn trong 3 phút.</p>.
      </p>
    `;
    sendMailHelper(email, title, html);

    return res.status(200).json({
      status: true,
      message: "OTP was sent to your email."
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/password/otp
const otp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const userExists = await userService.findByEmail(email);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User email not found."
      });
    }

    const forgotPasswordExists = await forgotPasswordService.findByUserIdAndOtp(userExists.id, otp);
    if (!forgotPasswordExists) {
      return res.status(400).json({
        status: false,
        message: "Email or otp were not found."
      });
    }

    const tokenInfo: Partial<IUserFull> = {
      code: userExists.id,
      role: userExists.role
    };
    const accessToken = jwtUtil.generateToken(tokenInfo, "1d");

    const refreshToken = jwtUtil.generateToken(tokenInfo, "7d");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({
      status: true,
      message: "Otp was correct.",
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

// [POST] /api/v1/users/password/reset
const reset = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userExists = await userService.findByEmail(email);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User email not found."
      });
    }

    const newUser = await userService.update(userExists.id, {
      password: md5Util.encodePassword(password)
    });
    return res.status(200).json({
      status: true,
      message: "Password was changed successfully.",
      data: newUser
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const userController = {
  me,
  register,
  login,
  refreshToken,
  forgot,
  otp,
  reset
};
export default userController;