import { NextFunction, Response } from "express";

const restrictTo = (roles: string[]) => (req: any, res: Response, next: NextFunction) => {
  try {
    const role = req.user.role;

    if (!roles.includes(role)) {
      return res.status(403).json({
        status: false,
        message: "Authorization unsucess."
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

export default restrictTo;