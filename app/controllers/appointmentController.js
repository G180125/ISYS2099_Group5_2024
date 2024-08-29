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
        JOIN department D ON ST.department_id = D.department_id
        LIMIT ? OFFSET ?`;

        const [results] = await mysqlClient.poolAdmin.query(query, [limit, offset]);

        const [countResult] = await mysqlClient.poolAdmin.query(`SELECT COUNT(*) as total FROM appoitment`);
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
      const email = req.email;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      console.log(email);

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

      const [results] = await mysqlClient.poolPatient.query(query, queryParams);
      const [countResult] = await mysqlClient.poolPatient.query(countQuery, countParams);

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
  },

  bookAppointment: async (req, res) => {
    try {
      const { appointmentId, date, timeSlot } = req.body;

      if(!appointmentId || !date || !timeSlot){
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
      }
      
      const query = `CALL update_appointment(?,?,?, @result, @message)`;
      const [rows] = await db.poolStaff.query(query, [appointmentId,date,timeSlot]);
      // If there are multiple result sets, select the last one
      const result = rows[0][0].result;
      const message = rows[0][0].message;
      
      if (result == 0) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(message).message });
      }

      return res  
          .status(httpStatus.OK().code)
          .json({ message: message });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({ 
        error: httpStatus.INTERNAL_SERVER_ERROR.message 
      });
    }
  },

  updateAppointment: async (req, res) => {
    try {
      const { appointmentId, date, timeSlot } = req.body;

      if(!appointmentId || !date || !timeSlot){
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
      }
      
      const query = `CALL update_appointment(?,?,?, @result, @message)`;
      const [rows] = await mysqlClient.poolStaff.query(query, [appointmentId,date,timeSlot]);
      // If there are multiple result sets, select the last one
      const result = rows[0][0].result;
      const message = rows[0][0].message;
      
      if (result == 0) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(message).message });
      }

      return res  
          .status(httpStatus.OK().code)
          .json({ message: message });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({ 
        error: httpStatus.INTERNAL_SERVER_ERROR.message 
      });
    }
  },
};

module.exports = appointmentController;
