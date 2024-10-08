const express = require("express");
const fileHandler = require("../middleware/fileHandler");
const mongoService = require("../services/mongoService");
const { StatusCodes } = require("http-status-codes");
const fileController = require("../controllers/fileController");
const fileRouter = express.Router();

/* 
use multi-part form
{
    fileTarget : <insert file>
    dirTarget: staff / treatment
    fileType: Avatar, ... check controller
    mysql_id: xxx
}
*/
fileRouter.post(
  "/upload",
  fileHandler.single("fileTarget"),
  fileController.uploadFile
);

// .../files/meta/staff/?mysql_id=1&type=Avatar
fileRouter.get("/meta/:bucket", fileController.getFileMeta);

// .../files/content/staff/:filename
fileRouter.get("/content/:bucket/:filename", fileController.getOneFile);

fileRouter.get("/staff_avatar/:id", fileController.getStaffAvatar);

module.exports = fileRouter;
