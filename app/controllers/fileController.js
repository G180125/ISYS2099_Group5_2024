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
    const bucket = req.params.bucket;
    const filters = {};
    if (req.query.mysql_id) filters["metadata.mysql_id"] = req.query.mysql_id;
    if (req.query.type) filters["metadata.type"] = req.query.type;

    const arr = await mongoService.getFileMeta(filters, bucket);

    return res.status(StatusCodes.ACCEPTED).json({
      result: arr,
    });
  },

  getOneFile: async (req, res, next) => {
    const bucket = req.params.bucket;
    const fileName = req.params.filename;

    try {
      const fileBuffer = await mongoService.getOneFile(fileName, bucket);
      const b64 = Buffer.from(fileBuffer).toString("base64");

      res.status(StatusCodes.ACCEPTED).json({
        filename: fileName,
        base64: b64,
      });
    } catch (err) {
      next(err);
    }
    
  },
};

module.exports = fileController;
