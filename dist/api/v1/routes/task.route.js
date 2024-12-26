"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const deserializeUser_middleware_1 = __importDefault(require("../middlewares/deserializeUser.middleware"));
const task_validate_1 = __importDefault(require("../validates/task.validate"));
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
router.get("/get", [deserializeUser_middleware_1.default], task_controller_1.default.get);
router.get("/get/:id", [deserializeUser_middleware_1.default], task_controller_1.default.getById);
router.post("/create", [deserializeUser_middleware_1.default, task_validate_1.default.create], task_controller_1.default.create);
router.patch("/update/:id", [deserializeUser_middleware_1.default, task_validate_1.default.update], task_controller_1.default.update);
router.patch("/change-status/:status/:id", [deserializeUser_middleware_1.default, task_validate_1.default.changeStatus], task_controller_1.default.changeStatus);
router.patch("/change-multi", [deserializeUser_middleware_1.default, task_validate_1.default.changeMulti], task_controller_1.default.changeMulti);
router.delete("/delete/:id", [deserializeUser_middleware_1.default], task_controller_1.default.del);
exports.default = router;
