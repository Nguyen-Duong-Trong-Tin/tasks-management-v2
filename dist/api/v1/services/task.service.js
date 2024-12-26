"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_model_1 = __importDefault(require("../models/task.model"));
const find_helper_1 = __importDefault(require("../../../helpers/find.helper"));
const pagination_helper_1 = __importDefault(require("../../../helpers/pagination.helper"));
const sort_helper_1 = __importDefault(require("../../../helpers/sort.helper"));
const find = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const myUserId = req.user.code;
    const find = (0, find_helper_1.default)(req.query);
    const sort = (0, sort_helper_1.default)(req.query);
    const taskLength = yield task_model_1.default.countDocuments();
    const pagination = (0, pagination_helper_1.default)(req.query, taskLength);
    const tasks = yield task_model_1.default
        .find(Object.assign(Object.assign({}, find), { $or: [
            { "createdBy": myUserId },
            { "users": myUserId }
        ] }))
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit);
    return tasks;
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const taskExists = yield task_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    return taskExists;
});
const create = (task) => __awaiter(void 0, void 0, void 0, function* () {
    const newTask = new task_model_1.default(task);
    yield newTask.save();
    return newTask;
});
const update = (id, task) => __awaiter(void 0, void 0, void 0, function* () {
    const newTask = yield task_model_1.default.findOneAndUpdate({
        _id: id
    }, task, {
        new: true,
        runValidators: true
    });
    return newTask;
});
const del = (id, task) => __awaiter(void 0, void 0, void 0, function* () {
    const newTask = yield task_model_1.default.findOneAndUpdate({
        _id: id
    }, task, {
        new: true
    });
    return newTask;
});
const taskService = {
    find,
    findById,
    create,
    update,
    del
};
exports.default = taskService;
