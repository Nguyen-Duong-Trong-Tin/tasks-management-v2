import { NextFunction, Response } from "express";
import jwtUtil from "../utils/jwt.util";

const response401 = (res: Response) => {
  return res.status(401).json({
    status: false,
    message: "Authenrization unsucess."
  });
}

const deserializeUser = (req: any, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return response401(res);
    }

    const authorizationArray = authorization.split(" ");
    if (authorizationArray.length !== 2) {
      return response401(res);
    }

    const bearer = authorizationArray[0];
    if (bearer !== "Bearer") {
      return response401(res);
    }

    const accessToken = authorizationArray[1];
    const verify = jwtUtil.verifyToken(accessToken);

    if (verify.expire) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return response401(res);
      }

      const verifyRefreshToken = jwtUtil.verifyToken(refreshToken);
      if (!verifyRefreshToken.success) {
        res.clearCookie("refreshToken");
        return response401(res);
      }

      return res.status(401).json({
        status: false,
        message: "Access token was expire."
      });
    }

    if (!verify.success) {
      return response401(res);
    }

    req.user = verify.data;
    return next();
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

export default deserializeUser;