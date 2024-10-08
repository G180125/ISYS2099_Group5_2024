const appointmentRouter = require("./appointmentRouter");
const authRouter = require("./authRouter");
const patientRouter = require("./patientRouter");
const scheduleRouter = require("./scheduleRouter");
const staffRouter = require("./staffRouter");
const treatmentRecordRouter = require("./treatmentRecordRouter");
const treatmentRouter = require("./treatmentRouter");
const departmentRouter = require("./departmentRouter");
const reportRouter = require("./reportRouter");
const fileRouter = require("./fileRouter");
const ticketRouter = require("./ticketRouter");

module.exports = {
    appointmentRouter,
    authRouter,
    scheduleRouter,
    patientRouter,
    staffRouter,
    treatmentRecordRouter,
    departmentRouter,
    reportRouter,
    fileRouter,
    ticketRouter,
    treatmentRouter
};
