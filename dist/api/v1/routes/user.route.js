"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const deserializeUser_middleware_1 = __importDefault(require("../middlewares/deserializeUser.middleware"));
const user_validate_1 = __importDefault(require("../validates/user.validate"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
router.get("/me", [deserializeUser_middleware_1.default], user_controller_1.default.me);
router.post("/register", user_validate_1.default.register, user_controller_1.default.register);
router.post("/login", user_validate_1.default.login, user_controller_1.default.login);
router.post("/refresh-token", [deserializeUser_middleware_1.default], user_controller_1.default.refreshToken);
router.post("/password/forgot", user_validate_1.default.forgot, user_controller_1.default.forgot);
router.post("/password/otp", user_validate_1.default.otp, user_controller_1.default.otp);
router.post("/password/reset", [deserializeUser_middleware_1.default, user_validate_1.default.reset], user_controller_1.default.reset);
exports.default = router;
