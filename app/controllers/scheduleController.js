const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("../models/db.js");
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

const scheduleController = {
    getAllSchedules: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;

        // Query to fetch patients with pagination
        const [results] = await db.poolAdmin.query(`
        SELECT S.staff_id, 
          S.schedule_date, 
          S.time_slot, 
          ST.first_name, 
          ST.last_name, 
          ST.email, 
          ST.gender, 
          ST.job_type, 
          D.department_name
        FROM schedule S 
        JOIN staff ST ON S.staff_id = ST.staff_id
        JOIN department D ON ST.department_id = D.department_id
        LIMIT ? OFFSET ?`, [limit, offset]);

        // Optionally, fetch the total number of records for pagination metadata
        const [countResult] = await db.poolAdmin.query(`SELECT COUNT(*) as total FROM schedule`);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
          results,
          pagination: {
            totalRecords,
            totalPages,
            currentPage: page,
            pageSize: limit,
          }
        });
      } catch (error) {
          console.error(error);
          res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
      }
    },

    getAllSchedulesByStaff: async (req, res) => {
      try {
        const staffId = req.body.staff_id;
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;
        
        const query = `CALL view_staff_schedule(?, ?, ?)`;
        const results = await db.poolPatient.query(query, [staffId, limit, offset]);

        const errorMessage = results[0]?.[0]?.message;
        if (errorMessage) {
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
        }
  
        // Return results with pagination metadata
        res.json({
          results,
          pagination: {
            totalRecords,
            totalPages,
            currentPage: page,
            pageSize: limit,
          }
        });
      } catch (error) {
        console.error(error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
      }
    },

    updateSchedule: async (req, res) => {

    },


}

module.exports = scheduleController;