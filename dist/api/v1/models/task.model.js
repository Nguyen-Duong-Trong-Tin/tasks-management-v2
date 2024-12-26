"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const task_enum_1 = require("../enums/task.enum");
const TaskSchema = new mongoose_1.default.Schema({
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
        enum: Object.values(task_enum_1.ETaskStatus),
        required: true
    },
    users: {
        type: Array
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users"
    },
    deletedAt: {
        type: Date
    },
});
const TaskModel = mongoose_1.default.model("tasks", TaskSchema);
exports.default = TaskModel;
