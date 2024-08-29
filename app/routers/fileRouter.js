const express = require("express");
const fileHandler = require("../middleware/fileHandler");
const mongoService = require("../services/mongoService");
const { StatusCodes } = require("http-status-codes");
const fileController = require("../controllers/fileController");
const fileRouter = express.Router();

fileRouter.post(
    "/upload",
    fileHandler.single("fileTarget"),
    fileController.uploadFile
);

module.exports = fileRouter;
