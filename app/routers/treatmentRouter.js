const express = require("express");
const treatmentRouter = express.Router();
const treatmentController = require("../controllers/treatmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get treatment by patient
treatmentRouter.get(
    "/my",
    authenticate,
    checkRoles(["patient"]),
    treatmentController.getMyTreatments
);

treatmentRouter.get(
    "/patient",
    authenticate,
    checkRoles(["staff", "admin"]),
    treatmentController.getTreatmentsByPatient
);

treatmentRouter.get(
    "/id",
    authenticate,
    checkRoles(["patient", "staff", "admin"]),
    treatmentController.getTreatmentById
);

treatmentRouter.post(
    "/new",
    authenticate,
    checkRoles(("staff")),
    treatmentController.addTreatment
);

module.exports = treatmentRouter;