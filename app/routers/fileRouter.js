const express = require("express");
const fileHandler = require("../middleware/fileHandler");
const mongoService = require("../services/mongoService");
const { StatusCodes } = require("http-status-codes");
const fileController = require("../controllers/fileController");
const fileRouter = express.Router();

// use multi-part form
fileRouter.post(
    "/upload",
    fileHandler.single("fileTarget"),
    fileController.uploadFile
);

/* 
{
    "mysql_id" : "3927188"
}
*/
fileRouter.get("/meta", fileController.getFileMeta);

/* 
{
    "fileTarget" : "1724911268187-08d6725d-a884-4b0e-8706-0d5a90f3de16.jpg",
    "dirTarget": "treatment"
}
*/
fileRouter.get("/find", fileController.getOneFile);
module.exports = fileRouter;
