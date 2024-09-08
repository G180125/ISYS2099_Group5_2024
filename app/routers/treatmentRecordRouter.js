const express = require("express");
const treatmentRecordRouter = express.Router();
const treatmentRecordController = require("../controllers/treatmentRecordController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get treatmentRecord by patient
// {{base_url}}/treatment_record/my
treatmentRecordRouter.get(
    "/my",
    authenticate,
    checkRoles(["patient"]),
    treatmentRecordController.getMyTreatmentRecords
);

// {{base_url}}/treatment_record/appointment/8
treatmentRecordRouter.get(
    "/appointment/:id",
    authenticate,
    checkRoles(["staff", "admin", "patient"]),
    treatmentRecordController.getTreatmentRecordsByAppointment
);

// {{base_url}}/treatment_record/patient/41
treatmentRecordRouter.get(
    "/patient/:id",
    authenticate,
    checkRoles(["staff", "admin"]),
    treatmentRecordController.getTreatmentRecordsByPatient
);

// {{base_url}}/treatment_record/id
// {
//     "treatmentRecordId": "1"
// }
treatmentRecordRouter.get(
    "/:id",
    authenticate,
    checkRoles(["patient", "staff", "admin"]),
    treatmentRecordController.getTreatmentRecordById
);

// {{base_url}}/treatment_record/new
// {
//     "treatmentRecord_id": "3",
//     "treatmentRecord_date":"2024-09-15",
//     "appointment_id":"3"
// }
treatmentRecordRouter.post(
    "/new",
    authenticate,
    checkRoles(["staff"]),
    treatmentRecordController.addTreatmentRecord
);

// {{base_url}}/treatment_record/missing
// {
//     "appointment_id":"3"
// }
treatmentRecordRouter.put(
    "/missing/:id",
    authenticate,
    checkRoles(["staff"]),
    treatmentRecordController.markTreatmentRecordAsMissing //mark from U to M 
);

// {{base_url}}/treatment_record/finish
// {
//     "appointment_id":"3"
// }
treatmentRecordRouter.put(
    "/finish/:id",
    authenticate,
    checkRoles(["staff"]),
    treatmentRecordController.finishTreatmentRecord
);

module.exports = treatmentRecordRouter;