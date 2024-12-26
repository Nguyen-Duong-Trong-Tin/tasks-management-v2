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
const user_model_1 = __importDefault(require("../models/user.model"));
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.default
        .findOne({
        _id: id,
        deleted: false
    })
        .select("-password");
    return userExists;
});
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.default
        .findOne({
        email: email,
        deleted: false
    })
        .select("-password");
    return userExists;
});
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.default
        .findOne({
        email: email,
        password: password,
        deleted: false
    })
        .select("-password");
    return userExists;
});
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new user_model_1.default(user);
    yield newUser.save();
    const userExists = yield user_model_1.default
        .findOne({
        _id: newUser.id,
        deleted: false
    })
        .select("-password");
    return userExists;
});
const update = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_model_1.default.findOneAndUpdate({
        _id: id,
        deleted: false
    }, user, {
        new: true,
        runValidators: true
    });
    return newUser;
});
const userService = {
    findById,
    findByEmail,
    login,
    register,
    update
};
exports.default = userService;
