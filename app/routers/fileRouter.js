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

// use raw data / url-encoded form
fileRouter.get("/meta", fileController.getFileMeta);

module.exports = fileRouter;
