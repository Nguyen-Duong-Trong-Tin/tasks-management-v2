const jwt = require("jsonwebtoken");

import { IUserFull } from "../interfaces/user.interface";

interface IVerify {
  success: boolean,
  expire: boolean,
  data: Partial<IUserFull>
}

const generateToken = (user: Partial<IUserFull>, expiresIn: string) => {
  return jwt.sign(
    user,
    process.env.TOKEN_SECRET,
    {
      expiresIn: expiresIn
    }
  );
}

const verifyToken = (token: string) => {
  const verify: IVerify = {
    success: false,
    expire: false,
    data: {}
  };

  const handleVerify = (e: any, user: any) => {
    if (e) {
      const errorName = e.name;
      if (errorName === "TokenExpiredError") {
        verify.expire = true;
      }

      return;
    }

    verify.success = true;
    verify.data = user;
    return;
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    handleVerify
  );
  return verify;
}

const jwtUtil = {
  generateToken,
  verifyToken
};
export default jwtUtil;