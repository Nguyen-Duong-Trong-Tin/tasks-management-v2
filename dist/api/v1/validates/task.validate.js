"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_helper_1 = __importDefault(require("../../../helpers/validate.helper"));
const task_enum_1 = require("../enums/task.enum");
const create = (req, res, next) => {
    try {
        const title = req.body.title;
        const parentId = req.body.parentId;
        const description = req.body.description;
        const timeStart = req.body.timeStart;
        const timeFinish = req.body.timeFinish;
        const status = req.body.status;
        const users = req.body.users;
        if (title === undefined ||
            description === undefined ||
            timeStart === undefined ||
            timeFinish === undefined ||
            status === undefined) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if (typeof title !== "string" ||
            (parentId !== undefined && typeof parentId !== "string") ||
            typeof description !== "string" ||
            typeof timeStart !== "string" ||
            typeof timeFinish !== "string" ||
            typeof status !== "string" ||
            (users !== undefined && typeof users !== "object")) {
            return res.status(400).json({
                status: false,
                message: "Missing datatype."
            });
        }
        const timeStartDate = new Date(timeStart);
        if (!validate_helper_1.default.validateDate(timeStartDate)) {
            return res.status(400).json({
                status: false,
                message: "Time start was incorrect."
            });
        }
        const timeFinishDate = new Date(timeFinish);
        if (!validate_helper_1.default.validateDate(timeFinishDate)) {
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
        if (!Object.values(task_enum_1.ETaskStatus).includes(status)) {
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
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
const update = (req, res, next) => {
    try {
        const title = req.body.title;
        const parentId = req.body.parentId;
        const description = req.body.description;
        const timeStart = req.body.timeStart;
        const timeFinish = req.body.timeFinish;
        const status = req.body.status;
        const users = req.body.users;
        if (title === undefined &&
            parentId === undefined &&
            description === undefined &&
            timeStart === undefined &&
            timeFinish === undefined &&
            status === undefined &&
            users === undefined) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if ((title !== undefined && typeof title !== "string") ||
            (parentId !== undefined && typeof parentId !== "string") ||
            (description !== undefined && typeof description !== "string") ||
            (timeStart !== undefined && typeof timeStart !== "string") ||
            (timeFinish !== undefined && typeof timeFinish !== "string") ||
            (status !== undefined && typeof status !== "string") ||
            (users !== undefined && typeof users !== "object")) {
            return res.status(400).json({
                status: false,
                message: "Missing datatype."
            });
        }
        const timeStartDate = new Date(timeStart);
        if (timeStart !== undefined && !validate_helper_1.default.validateDate(timeStartDate)) {
            return res.status(400).json({
                status: false,
                message: "Time start was incorrect."
            });
        }
        const timeFinishDate = new Date(timeFinish);
        if (timeFinish !== undefined && !validate_helper_1.default.validateDate(timeFinishDate)) {
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
        if (!Object.values(task_enum_1.ETaskStatus).includes(status)) {
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
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
const changeStatus = (req, res, next) => {
    try {
        const status = req.params.status;
        if (!Object.values(task_enum_1.ETaskStatus).includes(status)) {
            return res.status(400).json({
                status: false,
                message: "Status was incorrect."
            });
        }
        return next();
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
const changeMulti = (req, res, next) => {
    try {
        const ids = req.body.ids;
        const type = req.body.type;
        if (!ids ||
            !type) {
            return res.status(400).json({
                status: false,
                message: "Missing required information."
            });
        }
        if ((typeof ids !== "object" || !ids.length) ||
            typeof type !== "string") {
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
                if (!Object.values(task_enum_1.ETaskStatus).includes(status)) {
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
    }
    catch (_a) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong."
        });
    }
};
const taskValidate = {
    create,
    update,
    changeStatus,
    changeMulti
};
exports.default = taskValidate;
