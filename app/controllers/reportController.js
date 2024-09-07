const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");

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
    viewPatientTreatment: async (req, res, next) => {
        const role = req.role;
        const { start_date, end_date, email } = req.query;
        if (!start_date || !end_date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Both start_date and end_date query parameters are required.").message });
        }
        
        // Set default values to NULL if they are not provided
        const email_ = email !== undefined && email !== '' ? email : null;

        try {
            const pool = mysqlClient.getPool(role);

            const [rows] = await pool.query("CALL view_patient_treatment(?, ?, ?, @result, @message)", [start_date, end_date, email_]);
            
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
            .json({
                message : 'Report retrieved successfully',
                results : rows[0]
            });
            // .json(httpStatus.OK("Reports retrieved successfully", rows));
        } catch (error) {
            return next(error);
        }
    },

    // Function to get a doctor work within a specific date range
    viewDoctorWork: async (req, res, next) => {
        const role = req.role;
        const { start_date, end_date, email } = req.query; 

        if (!start_date || !end_date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Both start_date and end_date parameters are required.").message });
        }
        
        // Set default values to NULL if they are not provided
        const email_ = email !== undefined && email !== '' ? email : null;

        try {
            const pool = mysqlClient.getPool(role);

            const [rows] = await pool.query("CALL view_doctor_work(?, ?, ?, @result, @message)", [start_date, end_date, email_]);
            
            if (rows[0].length === 0) {
                return res
                .status(httpStatus.NOT_FOUND().code)
                .json({ error: httpStatus.NOT_FOUND("No reports found for the given date.").message });
            }
            // console.log(rows);
            const message = rows[1][0].message;
            const result = rows[1][0].result;
            
            if (result == 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code)
                  .json({ error: httpStatus.BAD_REQUEST(message).message });
            }
            
            const results = rows[0].map(obj => ({...obj, time: timeSlotMap[obj.time]}));
            
            // Convert the time_slot numbers to their corresponding time ranges
            const resultsWithTimeSlots = rows.map(result => ({
                ...result,
                time: timeSlotMap[rows.time]
            }));

            // console.log(resultsWithTimeSlots);

            return res
            .status(httpStatus.OK().code)
            .json({
                message : 'Reports retrieved successfully',
                results : results
            });
            // .json(httpStatus.OK("Reports retrieved successfully", resultsWithTimeSlots));
        } catch (error) {
            return next(error);
        }
    },

    // Function to get a staff job changes within a specific date range
    viewStaffJobChanges: async (req, res, next) => {
        const role = req.role;
        const { start_date, end_date, email } = req.query;

        if (!start_date || !end_date) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Both start_date and end_date parameters are required.").message });
        }
        
        // Set default values to NULL if they are not provided
        const email_ = email !== undefined && email !== '' ? email : null;

        try {
            const pool = mysqlClient.getPool(role);

            const [rows] = await pool.query("CALL view_staff_job_change(?, ?, ?, @result, @message)", [start_date, end_date, email_]);
            
            // if (rows[0].length === 0) {
            //     return res
            //     .status(httpStatus.NOT_FOUND().code)
            //     .json({ error: httpStatus.NOT_FOUND("No reports found for the given date.").message });
            // }
            console.log(rows);
            let message = rows[1][0].message;
            const result = rows[1][0].result;
            
            if (result == 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code)
                  .json({ error: httpStatus.BAD_REQUEST(message).message });
            }
            
            if (rows[0].length === 0) 
                message = 'No reports found!';
            // Convert the time_slot numbers to their corresponding time ranges

            return res
                .status(httpStatus.OK().code)
                .json({
                    message : message,
                    results : rows[0]
                });
        } catch (error) {
            return next(error);
        }
    },

    viewBilling: async (req, res, next) => {
        const role = req.role;
        const { appointment_id, patient_id } = req.query; 
      
        if (!appointment_id) {
          return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No input for Appointment Id").message });
        }
      
        try {
          const pool = mysqlClient.getPool(role);
      
          let query = `SELECT * FROM billing_report WHERE appointment_id = ?`;
          let queryParams = [appointment_id];
      
          // Restrict the query if patient_id is provided
          if (patient_id) {
            query += ` AND patient_id = ?`;
            queryParams.push(patient_id);
          }
      
          const [rows] = await pool.query(query, queryParams);
      
          // Check if the result set is empty
          if (rows.length === 0) {
            return res
              .status(httpStatus.NOT_FOUND().code)
              .json({ error: httpStatus.NOT_FOUND("No reports found for the given appointment.").message });
          }
      
          const billingReport = rows[0]; 
      
          return res
            .status(httpStatus.OK().code)
            .json({ message: "Reports retrieved successfully", data: billingReport });
          
        } catch (error) {
          console.error("Error in viewBilling:", error.message);
          return next(error);
        }
      }
};

module.exports = reportController;
