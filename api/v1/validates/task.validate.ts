import { NextFunction, Request, Response } from "express";
import validateHelper from "../../../helpers/validate.helper";
import { ETaskStatus } from "../enums/task.enum";

// [POST] /api/v1/tasks/create
const create = (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = req.body.title;
    const parentId = req.body.parentId;
    const description = req.body.description;
    const timeStart = req.body.timeStart;
    const timeFinish = req.body.timeFinish;
    const status = req.body.status;
    const users = req.body.users;

    if (
      title === undefined ||
      description === undefined ||
      timeStart === undefined ||
      timeFinish === undefined ||
      status === undefined
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required information."
      });
    }

    if (
      typeof title !== "string" ||
      (parentId !== undefined && typeof parentId !== "string") ||
      typeof description !== "string" ||
      typeof timeStart !== "string" ||
      typeof timeFinish !== "string" ||
      typeof status !== "string" ||
      (users !== undefined && typeof users !== "object")
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing datatype."
      });
    }

    const timeStartDate = new Date(timeStart);
    if (!validateHelper.validateDate(timeStartDate)) {
      return res.status(400).json({
        status: false,
        message: "Time start was incorrect."
      });
    }

    const timeFinishDate = new Date(timeFinish);
    if (!validateHelper.validateDate(timeFinishDate)) {
      return res.status(400).json({
        status: false,
        message: "Time finish was incorrect."
      });
    }

    if (timeStart > timeFinish) {
      return res.status(400).json({
        status: false,
        message: "Time start must be less than time finish."
      });
    }

    if (!Object.values(ETaskStatus).includes(status as ETaskStatus)) {
      return res.status(400).json({
        status: false,
        message: "Status was incorrect."
      });
    }

    if (users) {
      const userSet = new Set(users);
      if (users.length !== userSet.size) {
        return res.status(400).json({
          status: false,
          message: "Users was incorrect."
        });
      }
    }

    return next();
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/tasks/update/:id
const update = (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = req.body.title;
    const parentId = req.body.parentId;
    const description = req.body.description;
    const timeStart = req.body.timeStart;
    const timeFinish = req.body.timeFinish;
    const status = req.body.status;
    const users = req.body.users;

    if (
      title === undefined &&
      parentId === undefined &&
      description === undefined &&
      timeStart === undefined &&
      timeFinish === undefined &&
      status === undefined &&
      users === undefined
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required information."
      });
    }

    if (
      (title !== undefined && typeof title !== "string") ||
      (parentId !== undefined && typeof parentId !== "string") ||
      (description !== undefined && typeof description !== "string") ||
      (timeStart !== undefined && typeof timeStart !== "string") ||
      (timeFinish !== undefined && typeof timeFinish !== "string") ||
      (status !== undefined && typeof status !== "string") ||
      (users !== undefined && typeof users !== "object")
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing datatype."
      });
    }

    const timeStartDate = new Date(timeStart);
    if (timeStart !== undefined && !validateHelper.validateDate(timeStartDate)) {
      return res.status(400).json({
        status: false,
        message: "Time start was incorrect."
      });
    }

    const timeFinishDate = new Date(timeFinish);
    if (timeFinish !== undefined && !validateHelper.validateDate(timeFinishDate)) {
      return res.status(400).json({
        status: false,
        message: "Time finish was incorrect."
      });
    }

    if (timeStart !== undefined && timeFinish !== undefined) {
      if (timeStartDate > timeFinishDate) {
        return res.status(400).json({
          status: false,
          message: "Time start must less than time finish."
        });
      }
    }

    if (!Object.values(ETaskStatus).includes(status as ETaskStatus)) {
      return res.status(400).json({
        status: false,
        message: "Status was incorrect."
      });
    }

    if (users) {
      const userSet = new Set(users);
      if (users.length !== userSet.size) {
        return res.status(400).json({
          status: false,
          message: "Users was incorrect."
        });
      }
    }

    return next();
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/change-status/:status/:id
const changeStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.params.status;

    if (!Object.values(ETaskStatus).includes(status as ETaskStatus)) {
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

// [PATCH] /api/v1/change-multi/:id
const changeMulti = (req: Request, res: Response, next: NextFunction) => {
  try {
    const ids = req.body.ids as Array<string>;
    const type = req.body.type;

    if (
      !ids ||
      !type
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required information."
      });
    }

    if (
      (typeof ids !== "object" || !ids.length) ||
      typeof type !== "string"
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing datatype."
      });
    }

    switch (type) {
      case "status": {
        const status = req.body.status;

        if (!status) {
          return res.status(400).json({
            status: false,
            message: "Missing required information."
          });
        }

        if (typeof status !== "string") {
          return res.status(400).json({
            status: false,
            message: "Missing datatype."
          });
        }

        if (!Object.values(ETaskStatus).includes(status as ETaskStatus)) {
          return res.status(400).json({
            status: false,
            message: "Status was incorrect."
          });
        }

        return next();
      }

      case "delete": {
        return next();
      }

      default: {
        return res.status(400).json({
          status: false,
          message: "Type was incorrect."
        });
      }
    }
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const taskValidate = {
  create,
  update,
  changeStatus,
  changeMulti
};
export default taskValidate;