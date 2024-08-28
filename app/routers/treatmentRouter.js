const express = require("express");
const treatmentRouter = express.Router();
const treatmentController = require("../controllers/treatmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

treatmentRouter.post(
    "/new",
    authenticate,
    checkRoles(("staff")),
    treatmentController.addTreatment
);

module.exports = treatmentRouter;