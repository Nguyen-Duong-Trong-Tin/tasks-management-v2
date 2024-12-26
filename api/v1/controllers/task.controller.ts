import { Request, Response } from "express";

import taskService from "../services/task.service";
import { ETaskStatus } from "../enums/task.enum";
import userService from "../services/user.service";

// [GET] /api/v1/tasks/get?status?=:status&searchKey?=:searchKey&searchValue?=:searchValue&sortKey?=:sortKey&sortValue?=:sortValue&page?=:page&limit?=:limit
const get = async (req: any, res: Response) => {
  try {
    const tasks = await taskService.find(req);

    return res.status(200).json({
      status: true,
      message: "Tasks found.",
      data: tasks
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [GET] /api/v1/tasks/get/:id
const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const taksExists = await taskService.findById(id);
    if (!taksExists) {
      return res.status(404).json({
        status: false,
        message: "Task id not found."
      });
    }
    return res.status(200).json({
      status: true,
      message: "Task found.",
      data: taksExists
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/tasks/create
const create = async (req: any, res: Response) => {
  try {
    const myUserId = req.user.code;

    const title = req.body.title;
    const parentId = req.body.parentId;
    const description = req.body.description;
    const timeStart = req.body.timeStart;
    const timeFinish = req.body.timeFinish;
    const status = req.body.status;
    const users = req.body.users;

    const taskParentExists = await taskService.findById(parentId);
    if (parentId !== undefined && !taskParentExists) {
      return res.status(400).json({
        status: false,
        message: "Parent id not found."
      });
    }

    if (users) {
      for (const id of users) {
        const userExists = await userService.findById(id);
        if (!userExists) {
          return res.status(400).json({
            status: false,
            message: "User id not found."
          });
        }
      }
    }

    const newTasks = await taskService.create({
      title: title,
      parentId: parentId,
      description: description,
      timeStart: timeStart,
      timeFinish: timeFinish,
      status: status,
      users: users,
      createdBy: myUserId,
      createdAt: new Date()
    });
    return res.status(201).json({
      status: true,
      message: "Task was created successfully.",
      data: newTasks
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/tasks/update/:id
const update = async (req: any, res: Response) => {
  try {
    const myUserId = req.user.code;

    const id = req.params.id;

    const title = req.body.title;
    const parentId = req.body.parentId;
    const description = req.body.description;
    const timeStart = req.body.timeStart;
    const timeFinish = req.body.timeFinish;
    const status = req.body.status;
    const users = req.body.users;

    const taskExists = await taskService.findById(id);
    if (!taskExists) {
      return res.status(404).json({
        status: false,
        message: "Task id not found."
      });
    }

    const taskParentExists = await taskService.findById(parentId);
    if (parentId !== undefined) {
      if (id === parentId) {
        return res.status(400).json({
          status: false,
          message: "Id must be not equal parent id."
        });
      }

      if (!taskParentExists) {
        return res.status(400).json({
          status: false,
          message: "Parent id not found."
        });
      }
    }

    if (
      timeStart !== undefined &&
      timeFinish === undefined
    ) {
      const timeStartDate = new Date(timeStart);
      const timeFinishDate = taskExists.timeFinish;

      if (timeStartDate > timeFinishDate) {
        return res.status(400).json({
          status: false,
          message: "Time start must be less than time finish."
        });
      }
    }
    if (
      timeStart === undefined &&
      timeFinish !== undefined
    ) {
      const timeStartDate = taskExists.timeStart;
      const timeFinishDate = new Date(timeFinish);
      if (timeStartDate > timeFinishDate) {
        return res.status(400).json({
          status: false,
          message: "Time start must be less than time finish."
        });
      }
    }

    if (users) {
      for (const id of users) {
        const userExists = await userService.findById(id);
        if (!userExists) {
          return res.status(400).json({
            status: false,
            message: "User id not found."
          });
        }
      }
    }

    const newTask = await taskService.update(id, {
      title: title,
      parentId: parentId,
      description: description,
      timeStart: timeStart,
      timeFinish: timeFinish,
      status: status,
      users: users,
      updatedBy: myUserId,
      updatedAt: new Date()
    });
    return res.status(200).json({
      status: true,
      message: "Task was updated sucessfully.",
      data: newTask
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/tasks/change-status/:status/:id
const changeStatus = async (req: any, res: Response) => {
  try {
    const myUserId = req.user.code;

    const id = req.params.id;
    const status = req.params.status as ETaskStatus;

    const taskExists = await taskService.findById(id);
    if (!taskExists) {
      return res.status(404).json({
        status: false,
        message: "Task id not found."
      });
    }

    const newTask = await taskService.update(id, {
      status: status,
      updatedBy: myUserId,
      updatedAt: new Date()
    });
    return res.status(200).json({
      status: true,
      message: "Task was updated successfully.",
      data: newTask
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/tasks/change-multi
const changeMulti = async (req: any, res: Response) => {
  try {
    const myUserId = req.user.code;

    const ids = req.body.ids;

    const type = req.body.type;

    for (const id of ids) {
      const taskExists = await taskService.findById(id);
      if (!taskExists) {
        return res.status(400).json({
          status: false,
          message: "Tasks id not found."
        });
      }
    }

    const tasks = [];
    switch (type) {
      case "status": {
        const status = req.body.status as ETaskStatus;

        for (const id of ids) {
          const newTask = await taskService.update(id, { 
            status: status,
            updatedBy: myUserId,
            updatedAt: new Date()
          });
          tasks.push(newTask);
        }

        break;
      }

      case "delete": {
        for (const id of ids) {
          const newTask = await taskService.del(id, {
            deleted: true,
            deletedBy: myUserId,
            deletedAt: new Date()
          });
          tasks.push(newTask);
        }

        break;
      }
    }

    return res.status(200).json({
      status: true,
      message: "Tasks were updated successfully.",
      data: tasks
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [DELETE] /api/v1/tasks/delete/:id
const del = async (req: any, res: Response) => {
  try {
    const myUserId = req.user.code;

    const id = req.params.id;

    const taskExists = await taskService.findById(id);
    if (!taskExists) {
      return res.status(404).json({
        status: false,
        message: "Task id not found."
      });
    }

    const newTask = await taskService.del(id, {
      deleted: true,
      deletedBy: myUserId,
      deletedAt: new Date()
    });
    return res.status(200).json({
      status: true,
      message: "Task was deleted successfully.",
      data: newTask
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const taskController = {
  get,
  getById,
  create,
  update,
  changeStatus,
  changeMulti,
  del
};
export default taskController;