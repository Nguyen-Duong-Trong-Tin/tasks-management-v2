"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = __importDefault(require("./user.route"));
const task_route_1 = __importDefault(require("./task.route"));
const mainRoutesV1 = (app) => {
    const prefix = "/api/v1";
    app.use(prefix + "/users", user_route_1.default);
    app.use(prefix + "/tasks", task_route_1.default);
};
exports.default = mainRoutesV1;
