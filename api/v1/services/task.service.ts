import { ITaskFull } from "../interfaces/task.interface";

import TaskModel from "../models/task.model";

import findHelper from "../../../helpers/find.helper";
import paginationHelper from "../../../helpers/pagination.helper";
import sortHelper from "../../../helpers/sort.helper";

const find = async (req: any) => {
  const myUserId = req.user.code;

  const find = findHelper(req.query);
  const sort = sortHelper(req.query);

  const taskLength = await TaskModel.countDocuments();
  const pagination = paginationHelper(req.query, taskLength);

  const tasks = await TaskModel
    .find({
      ...find,
      $or: [
        { "createdBy": myUserId },
        { "users": myUserId }
      ]
    })
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit);
  return tasks;
}

const findById = async (id: string) => {
  const taskExists = await TaskModel.findOne({
    _id: id,
    deleted: false
  });
  return taskExists;
}

const create = async (task: Partial<ITaskFull>) => {
  const newTask = new TaskModel(task);
  await newTask.save();
  return newTask;
}

const update = async (id: string, task: Partial<ITaskFull>) => {
  const newTask = await TaskModel.findOneAndUpdate({
    _id: id
  }, task, {
    new: true,
    runValidators: true
  });
  return newTask;
}

const del = async (id: string, task: Pick<ITaskFull, "deleted" | "deletedBy" | "deletedAt">) => {
  const newTask = await TaskModel.findOneAndUpdate({
    _id: id
  }, task, {
    new: true
  });
  return newTask;
}

const taskService = {
  find,
  findById,
  create,
  update,
  del
};
export default taskService;