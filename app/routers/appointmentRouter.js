const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");




/**
 * @swagger
 * /appointment/admin/all:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: A list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   description: Array of appointment objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Appointment ID
 *                       patient_name:
 *                         type: string
 *                         description: Name of the patient
 *                       doctor_name:
 *                         type: string
 *                         description: Name of the doctor
 *                       appointment_date:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time of the appointment
 *                 pagination:
 *                   type: object
 *                   description: Pagination details
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of appointments
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       description: Number of records per page
 *       500:
 *         description: Internal server error
 */

appointmentRouter.get(
    "/admin/all",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.getAllAppointments
  );
  
/**
 * @swagger
 * /appointment/patient/all:
 *   get:
 *     summary: Get appointments for a specific patient
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *         description: Number of records per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: A list of patient appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Internal server error
 */

  // Get schedules by patient
  appointmentRouter.get(
    "/patient/all",
    authenticate,
    checkRoles(["patient", "admin"]),
    appointmentController.getAppoinmentsByPatient
  );



  
  appointmentRouter.post(
    "/new",
    authenticate,
    checkRoles(["patient"]),
    appointmentController.bookAppointment
  );

  appointmentRouter.put(
    "",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.updateAppointment
  );
  
  appointmentRouter.put(
    "/cancel",
    authenticate,
    checkRoles(["patient"]),
    appointmentController.cancelAppointment
  );

module.exports = appointmentRouter;