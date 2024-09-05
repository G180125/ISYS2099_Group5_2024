const express = require("express");
const treatmentRouter = express.Router();
const treatmentController = require("../controllers/treatmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get treatment by patient
// {{base_url}}/treatment/my
treatmentRouter.get(
    "/my",
    authenticate,
    checkRoles(["patient"]),
    treatmentController.getMyTreatments
);

// {{base_url}}/treatment/patient
// {
//     "id": "1"
// }
treatmentRouter.get(
    "/patient/:id",
    authenticate,
    checkRoles(["staff", "admin"]),
    treatmentController.getTreatmentsByPatient
);

// {{base_url}}/treatment/id
// {
//     "treatmentId": "1"
// }
treatmentRouter.get(
    "/:id",
    authenticate,
    checkRoles(["patient", "staff", "admin"]),
    treatmentController.getTreatmentById
);

// {{base_url}}/treatment/new
// {
//     "treatment_name":"chemotherapy",
//     "treatment_date":"2024-09-15",
//     "appointment_id":"3"
// }
treatmentRouter.post(
    "/new",
    authenticate,
    checkRoles(["staff"]),
    treatmentController.addTreatment
);

module.exports = treatmentRouter;