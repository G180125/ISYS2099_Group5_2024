const { StatusCodes } = require("http-status-codes");
const mongoService = require("../services/mongoService");

const fileController = {
    uploadFile: async (req, res, next) => {
        try {
            // console.log(req.body);
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

    getFileMeta: async (req, res, next) => {
        const dirTarget = req.body.dirTarget || "staff";
        const filters = {
            "metadata.mysql_id": req.body.mysql_id || "",
        };
        
        const arr = await mongoService.getFileMeta(filters, dirTarget);
        return res.status(StatusCodes.ACCEPTED).json({
            results: arr,
        });
    },

    // getFileMeta : async (req, res, next) => {
    //     // get all metadata
    //     // const arr = await dbGetFileInfos();

    //     return res.status(StatusCodes.ACCEPTED).json({
    //         message: arr,
    //     });
    // };
};

module.exports = fileController;
