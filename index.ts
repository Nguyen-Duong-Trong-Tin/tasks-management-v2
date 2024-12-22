import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

import database from "./configs/database.config";
database.connect();

const port = process.env.PORT || 3000;

// Routes
import mainRoutesV1 from "./api/v1/routes";
mainRoutesV1(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});