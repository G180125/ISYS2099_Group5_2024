const { StatusCodes } = require("http-status-codes");
const mongoService = require("../services/mongoService");

const fileController = {
    uploadFile: async (req, res, next) => {
        try {
            const statusCode = req.file
                ? StatusCodes.ACCEPTED
                : StatusCodes.BAD_REQUEST;
            const message = req.file ? "File Uploaded!" : "No file received!";
            const dirTarget = req.body.dirTarget;

            await mongoService.uploadFile(req.file, dirTarget);

            return res.status(statusCode).json({
                message: message,
            });
        } catch (err) {
            console.dir(err);
            next(err);
        }
    },
};

module.exports = fileController;