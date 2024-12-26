"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors = require("cors");
app.use(cors());
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const database_config_1 = __importDefault(require("./configs/database.config"));
database_config_1.default.connect();
const port = process.env.PORT || 3000;
const routes_1 = __importDefault(require("./api/v1/routes"));
(0, routes_1.default)(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
