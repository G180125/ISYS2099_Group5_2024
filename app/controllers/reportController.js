const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("../models/db.js"); // Assume db.js has methods to execute stored procedures
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

// Define the reportController
const reportController = {

    // Function to get patient treatment history for a specific date
    viewReportForGivenDuration: async (req, res) => {
        const { date } = req.query;  // Assuming date is provided as a query parameter
        
        if (!date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Date parameter is required.").message });
        }
    
        try {
            const [results] = await db.poolAdmin.query("CALL view_patient_treatment_for_given_duration(?)", [date]);
            
            if (results.length === 0) {
                return res
                .status(httpStatus.NOT_FOUND().code)
                .json({ error: httpStatus.NOT_FOUND("No reports found for the given date.").message });
            }
            
            return res
            .status(httpStatus.OK().code)
            .json(httpStatus.OK("Reports retrieved successfully", results));

        } catch (error) {
            console.error(error);
            res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    },

    // Function to get patient treatment history within a specific date range
    viewReportInGivenDuration: async (req, res) => {
        const { start_date, end_date } = req.query; // Assuming dates are provided as query parameters

        if (!start_date || !end_date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Both start_date and end_date parameters are required.").message });
        }

        try {
            const [results] = await db.poolAdmin.query("CALL view_patient_treatment_in_given_duration(?, ?)", [start_date, end_date]);

            if (results.length === 0) {
                return res
                .status(httpStatus.NOT_FOUND().code)
                .json({ error: httpStatus.NOT_FOUND("No reports found for the given date.").message });
            }

            return res
            .status(httpStatus.OK().code)
            .json(httpStatus.OK("Reports retrieved successfully", results));
        } catch (error) {
            console.error(error);
            res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    }
};

module.exports = reportController;
