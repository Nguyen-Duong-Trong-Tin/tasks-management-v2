import mongoose from "mongoose";

import { ITaskFull } from "../interfaces/task.interface";
import { ETaskStatus } from "../enums/task.enum";

export interface TaskDocument extends ITaskFull, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  parentId: {
    type: String
  },
  description: {
    type: String
  },
  timeStart: {
    type: Date,
    required: true
  },
  timeFinish: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ETaskStatus),
    required: true
  },
  users: {
    type: Array
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  updatedAt: {
    type: Date
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  deletedAt: {
    type: Date
  },
});

const TaskModel = mongoose.model<TaskDocument>("tasks", TaskSchema);
export default TaskModel;