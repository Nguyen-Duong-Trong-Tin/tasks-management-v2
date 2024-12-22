import { NextFunction, Request, Response } from "express";

import validateHelper from "../../../helpers/validate.helper";
import { EUserRole, EUserStatus } from "../enums/user.enum";

// [POST] /api/v1/users/register
const register = (req: Request, res: Response, next: NextFunction) => {
  try {
    const fullName = req.body.full_name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const status = req.body.status;

    if (
      fullName === undefined ||
      email === undefined ||
      password === undefined ||
      role === undefined ||
      status === undefined
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required information."
      });
    }

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string" ||
      typeof status !== "string"
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing datatype."
      });
    }

    if (!validateHelper.validateEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Email was incorrect."
      });
    }

    if (!validateHelper.validatePassword(password)) {
      return res.status(400).json({
        status: false,
        message: "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
      });
    }

    if (!Object.values(EUserRole).includes(role as EUserRole)) {
      return res.status(400).json({
        status: false,
        message: "Role was incorrect."
      });
    }

    if (!Object.values(EUserStatus).includes(status as EUserStatus)) {
      return res.status(400).json({
        status: false,
        message: "Status was incorrect."
      });
    }

    return next();
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/login
const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (
      email === undefined ||
      password === undefined
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required information."
      });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing datatype."
      });
    }

    if (!validateHelper.validateEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Email was incorrect."
      });
    }

    if (!validateHelper.validatePassword(password)) {
      return res.status(400).json({
        status: false,
        message: "Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
      });
    }

    return next();
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const userValidate = {
  register,
  login
};
export default userValidate;