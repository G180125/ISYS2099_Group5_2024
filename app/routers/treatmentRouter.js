const express = require("express");
const treatmentRouter = express.Router();
const treatmentController = require("../controllers/treatmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all treatments
// {{base_url}}/treatment/all
treatmentRouter.get(
    "/all",
    authenticate,
    checkRoles(["admin", "staff"]),
    treatmentController.getAllTreatments
);

// {{base_url}}/treatment/1
treatmentRouter.get(
    "/:id",
    authenticate,
    checkRoles(["admin", "staff"]),
    treatmentController.getTreatmentById
);

// {{base_url}}/treatment/new
// {
//     "treatment_id": "3",
//     "treatment_name":"Mental Treatment",
//     "treatment_cost": "10000"
// }
treatmentRouter.post(
    "/new",
    authenticate,
    checkRoles(["admin"]),
    treatmentController.addTreatment
);

// {{base_url}}/treatment
// {
//     "treatment_id": "3",
//     "treatment_name": "Database Treatement"
// }
treatmentRouter.put(
    "",
    authenticate,
    checkRoles(["admin"]),
    treatmentController.updateTreatment
);

module.exports = treatmentRouter;