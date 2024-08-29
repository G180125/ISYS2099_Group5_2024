const appointmentRouter = require("./appointmentRouter");
const authRouter = require("./authRouter");
const patientRouter = require("./patientRouter");
const scheduleRouter = require("./scheduleRouter");
const staffRouter = require("./staffRouter");
const treatmentRouter = require("./treatmentRouter");
const departmentRouter = require("./departmentRouter");

module.exports = {
    appointmentRouter,
    authRouter,
    scheduleRouter,
    patientRouter,
    staffRouter,
    treatmentRouter,
    departmentRouter
};
