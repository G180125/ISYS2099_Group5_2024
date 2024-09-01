const { StatusCodes } = require("http-status-codes");
const mongoService = require("../services/mongoService");

const dirTargets = ["staff", "treatment"];
const treatmentFileTypes = [
  "Prescription",
  "Procedure",
  "Admission",
  "Discharge",
  "Preoperative",
];
const staffFileTypes = [
  "Avatar",
  "Certificate",
  "Curriculum Vitae",
  "References",
  "Legal Documents",
];
const fileTypes = {
  staff: staffFileTypes,
  treatment: treatmentFileTypes,
};

const fileController = {
  uploadFile: async (req, res, next) => {
    try {
      if (!req.file) throw new Error("No file received!");

      const file = req.file;
      const dirTarget = req.body.dirTarget;
      if (!dirTargets.includes(dirTarget))
        throw new Error(`Choose one of the following folders: ${dirTargets}`);

      const fileType = req.body.fileType;
      if (!fileTypes[dirTarget].includes(fileType))
        throw new Error(
          `Choose one of the following file types: ${fileTypes[dirTarget]}`
        );

      const mysql_id = req.body.mysql_id;
      if (!mysql_id) throw new Error("Missing field: mysql_id");

      const fileMeta = {
        mysql_id: mysql_id,
        type: dirTarget,
      };
      
      await mongoService.uploadFile(file, dirTarget, fileMeta);

      return res.status(StatusCodes.OK).json({
        message: "File Uploaded Succesfully!",
        fileName: file.originalname,
        directory: dirTarget,
      });
    } catch (err) {
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

  getOneFile: async (req, res, next) => {
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
  },
};

module.exports = fileController;
