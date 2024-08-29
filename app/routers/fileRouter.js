const express = require("express");
const fileHandler = require("../middleware/fileHandler");
const mongoService = require("../services/mongoService");
const { StatusCodes } = require("http-status-codes");
const fileRouter = express.Router();

fileRouter.post(
    "/upload",
    fileHandler.single("fileTarget"),
    async (req, res, next) => {
        try {
            const statusCode = req.file
                ? StatusCodes.ACCEPTED
                : StatusCodes.BAD_REQUEST;
            const fileInfo = req.file || "No file received!";
            const dirTarget = req.body.dirTarget;

            await mongoService.uploadFile(req.file, dirTarget);
            
            return res.status(statusCode).json({
                message: "File Uploaded!",
            });
        } catch (err) {
            console.dir(err);
            next(err);
        }
    }
);

module.exports = fileRouter;
