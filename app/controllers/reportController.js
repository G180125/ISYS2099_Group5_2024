const express = require("express");
const cookieParser = require("cookie-parser");
const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

const timeSlotMap = {
    1: "9:00-10:00",
    2: "10:00-11:00",
    3: "11:00-12:00",
    4: "12:00-13:00",
    5: "13:00-14:00",
    6: "14:00-15:00",
    7: "15:00-16:00",
    8: "16:00-17:00"
  };

// Define the reportController
const reportController = {

    // Function to get patient treatment history within a specific date range
    viewPatientTreatment: async (req, res) => {
        const { start_date, end_date, email } = req.body; // Assuming dates are provided as query parameters

        if (!start_date || !end_date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Both start_date and end_date parameters are required.").message });
        }
        
        // Set default values to NULL if they are not provided
        const email_ = email !== undefined && email !== '' ? email : null;

        try {
            const [rows] = await mysqlClient.poolAdmin.query("CALL view_patient_treatment(?, ?, ?, @result, @message)", [start_date, end_date, email_]);
            
            if (rows[0].length === 0) {
                return res
                .status(httpStatus.NOT_FOUND().code)
                .json({ error: httpStatus.NOT_FOUND("No reports found for the given date.").message });
            }
            console.log(rows);
            const message = rows[1][0].message;
            const result = rows[1][0].result;
            
            if (result == 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code)
                  .json({ error: httpStatus.BAD_REQUEST(message).message });
            }

            return res
            .status(httpStatus.OK().code)
            .json(httpStatus.OK("Reports retrieved successfully", rows));
        } catch (error) {
            console.error(error);
            res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    },

    // Function to get a doctor work within a specific date range
    viewDoctorWork: async (req, res) => {
        const { start_date, end_date, email } = req.body; // Assuming dates are provided as query parameters

        if (!start_date || !end_date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Both start_date and end_date parameters are required.").message });
        }
        
        // Set default values to NULL if they are not provided
        const email_ = email !== undefined && email !== '' ? email : null;

        try {
            const [rows] = await mysqlClient.poolAdmin.query("CALL view_doctor_work(?, ?, ?, @result, @message)", [start_date, end_date, email_]);
            
            if (rows[0].length === 0) {
                return res
                .status(httpStatus.NOT_FOUND().code)
                .json({ error: httpStatus.NOT_FOUND("No reports found for the given date.").message });
            }
            console.log(rows);
            const message = rows[1][0].message;
            const result = rows[1][0].result;
            
            if (result == 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code)
                  .json({ error: httpStatus.BAD_REQUEST(message).message });
            }
            
            // Convert the time_slot numbers to their corresponding time ranges
            const resultsWithTimeSlots = rows.map(result => ({
                ...result,
                time: timeSlotMap[rows.time]
            }));

            // console.log(resultsWithTimeSlots);

            return res
            .status(httpStatus.OK().code)
            .json(httpStatus.OK("Reports retrieved successfully", resultsWithTimeSlots));
        } catch (error) {
            console.error(error);
            res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    },

    // Function to get a staff job changes within a specific date range
    viewStaffJobChanges: async (req, res) => {
        const { start_date, end_date, email } = req.body; // Assuming dates are provided as query parameters

        if (!start_date || !end_date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Both start_date and end_date parameters are required.").message });
        }
        
        // Set default values to NULL if they are not provided
        const email_ = email !== undefined && email !== '' ? email : null;

        try {
            const [rows] = await mysqlClient.poolAdmin.query("CALL view_staff_job_change(?, ?, ?, @result, @message)", [start_date, end_date, email_]);
            
            if (rows[0].length === 0) {
                return res
                .status(httpStatus.NOT_FOUND().code)
                .json({ error: httpStatus.NOT_FOUND("No reports found for the given date.").message });
            }
            console.log(rows);
            const message = rows[1][0].message;
            const result = rows[1][0].result;
            
            if (result == 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code)
                  .json({ error: httpStatus.BAD_REQUEST(message).message });
            }
            
            // Convert the time_slot numbers to their corresponding time ranges
            const resultsWithTimeSlots = rows.map(result => ({
                ...result,
                time: timeSlotMap[rows.time]
            }));

            // console.log(resultsWithTimeSlots);

            return res
            .status(httpStatus.OK().code)
            .json(httpStatus.OK("Reports retrieved successfully", resultsWithTimeSlots));
        } catch (error) {
            console.error(error);
            res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    }
};

module.exports = reportController;
