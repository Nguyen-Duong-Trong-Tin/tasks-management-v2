import { ETaskStatus } from "../enums/task.enum";
import { UserDocument } from "../models/user.model";

interface ITask {
  title: string;
  parentId: string;
  description: string;
  timeStart: Date;
  timeFinish: Date;
  status: ETaskStatus;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

interface ITaskFull extends ITask {
  users: UserDocument["_id"][];
  createdBy: UserDocument["_id"];
  deletedBy: UserDocument["_id"];
  updatedBy: UserDocument["_id"];
};

export {
  ITask,
  ITaskFull
};