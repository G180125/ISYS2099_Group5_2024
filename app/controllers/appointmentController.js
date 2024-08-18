const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("../models/db.js");
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

const appointmentController = {
  getAllAppointments: async (req, res) => {
    try{    
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = 
        `SELECT P.first_name AS patient_first_name, P.last_name AS patient_last_name, 
            S.schedule_date, S.time_slot, ST.first_name AS staff_first_name, 
            ST.last_name AS staff_last_name, ST.email AS staff_email, 
            ST.gender AS staff_gender, ST.job_type, D.department_name 
        FROM appointment A
        JOIN patient P ON A.patient_id = P.patient_id
        JOIN schedule S ON A.schedule_id = S.schedule_id
        JOIN staff ST ON S.staff_id = ST.staff_id
        JOIN department D ON ST.department_id = D.department_id`;

        const [result] = await db.poolAdmin.query(query);

        const [countResult] = await db.poolAdmin.query(`SELECT COUNT(*) as total FROM appoitment`);
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
        console.error('Error fetching appointments:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({ 
          error: httpStatus.INTERNAL_SERVER_ERROR.message 
        });
      }
  },

  getAppoinmentsByPatient: async (req, res) => {
    try {
      const status = req.query.status;
      const email = req.cookies.email; 
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      let query = `
        SELECT P.first_name AS patient_first_name, P.last_name AS patient_last_name, 
               S.schedule_date, S.time_slot, ST.first_name AS staff_first_name, 
               ST.last_name AS staff_last_name, ST.email AS staff_email, 
               ST.gender AS staff_gender, ST.job_type, D.department_name 
        FROM appointment A
        JOIN patient P ON A.patient_id = P.patient_id
        JOIN schedule S ON A.schedule_id = S.schedule_id
        JOIN staff ST ON S.staff_id = ST.staff_id
        JOIN department D ON ST.department_id = D.department_id
        WHERE P.email = ?`;

      let countQuery = `
        SELECT COUNT(*) as total
        FROM appointment A
        JOIN patient P ON A.patient_id = P.patient_id
        WHERE P.email = ?`;

      let queryParams = [email, limit, offset];
      let countParams = [email];

      if (status) {
        query += ` AND A.status = ? LIMIT ? OFFSET ?`;
        queryParams = [email, status, limit, offset];

        countQuery += ` AND A.status = ?`;
        countParams = [email, status];
      } else {
        query += ` LIMIT ? OFFSET ?`;
      }

      const [results] = await db.poolPatient.query(query, queryParams);
      const [countResult] = await db.poolPatient.query(countQuery, countParams);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      // Convert the time_slot numbers to their corresponding time ranges
      const resultsWithTimeSlots = results.map(result => ({
        ...result,
        time_slot: timeSlotMap[result.time_slot]
      }));

      res.json({
        results: resultsWithTimeSlots,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: page,
          pageSize: limit,
        }
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({ 
        error: httpStatus.INTERNAL_SERVER_ERROR.message 
      });
    }
  }
};

module.exports = appointmentController;
