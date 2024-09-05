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
  getAllAppointments: async (req, res, next) => {
    try{    
        const role = req.role;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = 
        `SELECT 
        A.appointment_id, 
        S.schedule_date, 
        A.slot_number,
        A.purpose,
        ST.first_name AS staff_first_name, 
        ST.last_name AS staff_last_name,
        ST.gender AS staff_gender, 
        ST.job_type, 
        D.department_name,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', T.treatment_id,
                'name', T.treatment_name,
                'date', T.treatment_date
            )
        ) AS treatments
        FROM 
            appointment A
        JOIN 
            patient_secure_report P ON A.patient_id = P.patient_id
        JOIN 
            schedule S ON A.schedule_id = S.schedule_id
        JOIN 
            staff_secure_report ST ON S.staff_id = ST.staff_id
        JOIN 
            department D ON ST.department_id = D.department_id
        LEFT JOIN 
            treatment_record T ON A.appointment_id = T.appointment_id
        GROUP BY 
            A.appointment_id, S.schedule_date, A.slot_number, ST.first_name, ST.last_name, ST.gender, ST.job_type, D.department_name
        LIMIT ? OFFSET ?`;

        const pool = mysqlClient.getPool(role);

        const [results] = await pool.query(query, [limit, offset]);

        const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM appointment`);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
          results,
          pagination: {
            totalRecords: totalRecords,
            totalPages: totalPages,
            currentPage: page,
            pageSize: limit,
          }
        });
    } catch (error) {
        return next(error);
      }
  },

  getMyAppoinments: async (req, res, next) => {
    try {
      const role = req.role;
      const status = req.query.status || null;
      const id = req.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      console.log(id);

      // Corrected SQL Query
      let query = `
      SELECT 
      A.appointment_id, 
      S.schedule_date, 
      A.slot_number, 
      A.purpose,
      A.status,
      ST.first_name AS staff_first_name, 
      ST.last_name AS staff_last_name,
      ST.staff_id, 
      ST.job_type, 
      D.department_name,
      JSON_ARRAYAGG(
          JSON_OBJECT(
              'id', T.treatment_id,
              'name', T.treatment_name,
              'date', T.treatment_date
          )
      ) AS treatments
      FROM 
          appointment A
      JOIN 
        patient_secure_report P ON A.patient_id = P.patient_id
      JOIN 
          schedule S ON A.schedule_id = S.schedule_id
      JOIN 
          staff_secure_report ST ON S.staff_id = ST.staff_id
      JOIN 
          department D ON ST.department_id = D.department_id
      LEFT JOIN 
          treatment_record T ON A.appointment_id = T.appointment_id
      WHERE 
          A.patient_id = ?
      `;

      let countQuery = 
        `SELECT COUNT(*) as total
        FROM appointment A
        WHERE A.patient_id = ?`;

      let queryParams = [id, limit, offset];
      let countParams = [id];
  

      // Append LIMIT and OFFSET based on the condition
      if (status) {
      query += ` AND A.status = ? 
                GROUP BY A.appointment_id, S.schedule_date, A.slot_number, ST.first_name, ST.last_name, ST.gender, ST.job_type, D.department_name
                LIMIT ? OFFSET ?`;
      queryParams = [id, status, limit, offset];

      countQuery += ` AND A.status = ?`;
      countParams = [id, status];
      } else {
      query += `GROUP BY A.appointment_id, S.schedule_date, A.slot_number, ST.first_name, ST.last_name, ST.gender, ST.job_type, D.department_name LIMIT ? OFFSET ?`;
      queryParams = [id, limit, offset];
      }

      const pool = mysqlClient.getPool(role);

      const [results] = await pool.query(query, queryParams);
      const [countResult] = await pool.query(countQuery, countParams);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        results: results[0],
        pagination: {
          totalRecords: totalRecords,
          totalPages: totalPages,
          currentPage: page,
          pageSize: limit,
        }
      });
    } catch (error) {
      return next(error);
    }
  },

  getAppointmentsByPatient: async (req, res, next) => {
    try {
      const role = req.role;
      const status = req.query.status;
      const id = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Corrected SQL Query
      let query = `
      SELECT 
      A.appointment_id, 
      S.schedule_date, 
      A.slot_number, 
      A.purpose,
      A.status,
      ST.first_name AS staff_first_name, 
      ST.last_name AS staff_last_name,
      ST.gender AS staff_gender, 
      ST.job_type, 
      D.department_name,
      JSON_ARRAYAGG(
          JSON_OBJECT(
              'id', T.treatment_id,
              'name', T.treatment_name,
              'date', T.treatment_date
          )
      ) AS treatments
      FROM 
          appointment A
      JOIN 
          patient_secure_report P ON A.patient_id = P.patient_id
      JOIN 
          schedule S ON A.schedule_id = S.schedule_id
      JOIN 
          staff_secure_report ST ON S.staff_id = ST.staff_id
      JOIN 
          department D ON ST.department_id = D.department_id
      LEFT JOIN 
          treatment_record T ON A.appointment_id = T.appointment_id
      WHERE 
          P.patient_id = ?
      GROUP BY 
          A.appointment_id, S.schedule_date, A.slot_number, A.status, ST.first_name, ST.last_name, ST.gender, ST.job_type, D.department_name
      `;

      let countQuery = 
        `SELECT COUNT(*) as total
        FROM appointment A
        WHERE A.patient_id = ?`;

      let queryParams = [id, limit, offset];
      let countParams = [id];

      // Append LIMIT and OFFSET based on the condition
      if (status) {
        query += ` AND A.status = ? LIMIT ? OFFSET ?`;
        queryParams = [id, status, limit, offset];

        countQuery += ` AND A.status = ?`;
        countParams = [id, status];
      } else {
        query += ` LIMIT ? OFFSET ?`;
        queryParams = [id, limit, offset];
      }

      const pool = mysqlClient.getPool(role);

      const [results] = await pool.query(query, queryParams);
      const [countResult] = await pool.query(countQuery, countParams);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        results: results[0],
        pagination: {
          totalRecords: totalRecords,
          totalPages: totalPages,
          currentPage: page,
          pageSize: limit,
        }
      });
    } catch (error) {
      return next(error);
    }
  },

  bookAppointment: async (req, res, next) => {
    try {
      const role = req.role;
      const { patientID, doctorID, date, slotNumber, purpose } = req.body;

      if(!patientID || !doctorID || !date || !slotNumber){
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
      }

      const pool = mysqlClient.getPool(role);
      
      const query = `CALL book_an_appointment(?,?,?,?,?, @result, @message)`;
      const [rows] = await pool.query(query, [patientID, doctorID, date, slotNumber, purpose]);

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
      return next(error);
    }
  },

  updateAppointment: async (req, res, next) => {
    try {
      const role = req.role;
      const { appointmentId, date, timeSlot } = req.body;

      if(!appointmentId || !date || !timeSlot){
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
      }

      const pool = mysqlClient.getPool(role);

      const query = `CALL update_appointment(?,?,?, @result, @message)`;
      const [rows] = await pool.query(query, [appointmentId,date,timeSlot]);
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
      return next(error);
    }
  },

  cancelAppointment: async (req, res, next) => {
    try {
      const role = req.role;
      const patient_id = req.id;
      const { appointment_id } = req.body;
      
      if(!appointment_id || !patient_id){
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
      }
      console.log(appointment_id);
      console.log(patient_id);

      const pool = mysqlClient.getPool(role);

      const query = `CALL cancel_appointment(?,?, @result, @message)`;
      const [rows] = await pool.query(query, [appointment_id,patient_id]);
      // If there are multiple result sets, select the last one
      const result = rows[0][0].result;
      const message = rows[0][0].message;

      if (result == 0) {
        throw new Error(message);
      }

      return res  
          .status(httpStatus.OK().code)
          .json({ message: message });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = appointmentController;
