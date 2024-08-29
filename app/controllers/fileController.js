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

    getOneFile : async (req, res, next) => {
        const fileTarget = req.body.fileTarget;
        const dirTarget = req.body.dirTarget;
    
        try {
            const fileBuffer = await mongoService.getOneFile(fileTarget, dirTarget);
    
            const b64 = Buffer.from(fileBuffer).toString("base64");
            const mimeType = "image/jpg";
            const image = `<img src="data:${mimeType};base64,${b64}" />`;
    
            res.send(image);
        } catch (err) {
            next(err);
        }
    }
};

module.exports = fileController;
