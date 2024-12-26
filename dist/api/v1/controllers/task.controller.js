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
const task_service_1 = __importDefault(require("../services/task.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_service_1.default.find(req);
        return res.status(200).json({
            status: true,
            message: "Tasks found.",
            data: tasks
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const taksExists = yield task_service_1.default.findById(id);
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
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myUserId = req.user.code;
        const title = req.body.title;
        const parentId = req.body.parentId;
        const description = req.body.description;
        const timeStart = req.body.timeStart;
        const timeFinish = req.body.timeFinish;
        const status = req.body.status;
        const users = req.body.users;
        const taskParentExists = yield task_service_1.default.findById(parentId);
        if (parentId !== undefined && !taskParentExists) {
            return res.status(400).json({
                status: false,
                message: "Parent id not found."
            });
        }
        if (users) {
            for (const id of users) {
                const userExists = yield user_service_1.default.findById(id);
                if (!userExists) {
                    return res.status(400).json({
                        status: false,
                        message: "User id not found."
                    });
                }
            }
        }
        const newTasks = yield task_service_1.default.create({
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
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const taskExists = yield task_service_1.default.findById(id);
        if (!taskExists) {
            return res.status(404).json({
                status: false,
                message: "Task id not found."
            });
        }
        const taskParentExists = yield task_service_1.default.findById(parentId);
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
        if (timeStart !== undefined &&
            timeFinish === undefined) {
            const timeStartDate = new Date(timeStart);
            const timeFinishDate = taskExists.timeFinish;
            if (timeStartDate > timeFinishDate) {
                return res.status(400).json({
                    status: false,
                    message: "Time start must be less than time finish."
                });
            }
        }
        if (timeStart === undefined &&
            timeFinish !== undefined) {
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
                const userExists = yield user_service_1.default.findById(id);
                if (!userExists) {
                    return res.status(400).json({
                        status: false,
                        message: "User id not found."
                    });
                }
            }
        }
        const newTask = yield task_service_1.default.update(id, {
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
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myUserId = req.user.code;
        const id = req.params.id;
        const status = req.params.status;
        const taskExists = yield task_service_1.default.findById(id);
        if (!taskExists) {
            return res.status(404).json({
                status: false,
                message: "Task id not found."
            });
        }
        const newTask = yield task_service_1.default.update(id, {
            status: status,
            updatedBy: myUserId,
            updatedAt: new Date()
        });
        return res.status(200).json({
            status: true,
            message: "Task was updated successfully.",
            data: newTask
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myUserId = req.user.code;
        const ids = req.body.ids;
        const type = req.body.type;
        for (const id of ids) {
            const taskExists = yield task_service_1.default.findById(id);
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
                const status = req.body.status;
                for (const id of ids) {
                    const newTask = yield task_service_1.default.update(id, {
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
                    const newTask = yield task_service_1.default.del(id, {
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
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const del = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myUserId = req.user.code;
        const id = req.params.id;
        const taskExists = yield task_service_1.default.findById(id);
        if (!taskExists) {
            return res.status(404).json({
                status: false,
                message: "Task id not found."
            });
        }
        const newTask = yield task_service_1.default.del(id, {
            deleted: true,
            deletedBy: myUserId,
            deletedAt: new Date()
        });
        return res.status(200).json({
            status: true,
            message: "Task was deleted successfully.",
            data: newTask
        });
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
});
const taskController = {
    get,
    getById,
    create,
    update,
    changeStatus,
    changeMulti,
    del
};
exports.default = taskController;
