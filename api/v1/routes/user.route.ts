import express from "express";
const router = express.Router();

import deserializeUser from "../middlewares/deserializeUser.middleware";
import validate from "../validates/user.validate";
import controller from "../controllers/user.controller";

router.get("/test", controller.test);

router.get(
  "/me",
  [deserializeUser],
  controller.me
);

router.post(
  "/register",
  validate.register,
  controller.register
);
router.post(
  "/login",
  validate.login,
  controller.login
);
router.post(
  "/refresh-token",
  [deserializeUser],
  controller.refreshToken
);

router.post(
  "/password/forgot", 
  validate.forgot,
  controller.forgot
);
router.post(
  "/password/otp",
  validate.otp,
  controller.otp
);
router.post(
  "/password/reset",
  [deserializeUser, validate.reset],
  controller.reset
);

export default router;