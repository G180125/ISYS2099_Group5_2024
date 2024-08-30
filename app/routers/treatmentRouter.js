const express = require("express");
const treatmentRouter = express.Router();
const treatmentController = require("../controllers/treatmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get treatment by patient
// treatmentRouter.get(
//     "/patient/all",
//     authenticate,
//     checkRoles(["patient", "admin"]),
//     treatmentController.getAppoinmentsByPatient
// );

/**
 * @swagger
 * /treatment/new:
 *   post:
 *     summary: Add new treatment
 *     tags: [Treatment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               staff_id:
 *                 type: integer
 *                 example: 2
 *               treatment_name:
 *                 type: string
 *                 example: "Physical Therapy"
 *     responses:
 *       200:
 *         description: Treatment added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
treatmentRouter.post(
    "/new",
    authenticate,
    checkRoles(("staff")),
    treatmentController.addTreatment
);

module.exports = treatmentRouter;