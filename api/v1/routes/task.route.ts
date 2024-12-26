import express from "express";
const router = express.Router();

import deserializeUser from "../middlewares/deserializeUser.middleware";
import validate from "../validates/task.validate";
import controller from "../controllers/task.controller";

router.get(
  "/get",
  [deserializeUser],
  controller.get
);
router.get(
  "/get/:id",
  [deserializeUser],
  controller.getById
);

router.post(
  "/create",
  [deserializeUser, validate.create],
  controller.create
);

router.patch(
  "/update/:id",
  [deserializeUser, validate.update],
  controller.update
);
router.patch(
  "/change-status/:status/:id",
  [deserializeUser, validate.changeStatus],
  controller.changeStatus
);
router.patch(
  "/change-multi",
  [deserializeUser, validate.changeMulti],
  controller.changeMulti
);

router.delete(
  "/delete/:id",
  [deserializeUser],
  controller.del
);

export default router;