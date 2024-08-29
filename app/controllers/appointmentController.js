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
        `SELECT 
        A.appointment_id, 
        S.schedule_date, 
        A.slot_number, 
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
            patient P ON A.patient_id = P.patient_id
        JOIN 
            schedule S ON A.schedule_id = S.schedule_id
        JOIN 
            staff ST ON S.staff_id = ST.staff_id
        JOIN 
            department D ON ST.department_id = D.department_id
        LEFT JOIN 
            treatment_record T ON A.appointment_id = T.appointment_id
        GROUP BY 
            A.appointment_id, S.schedule_date, A.slot_number, ST.first_name, ST.last_name, ST.gender, ST.job_type, D.department_name
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

      // Corrected SQL Query
      let query = `
      SELECT 
      A.appointment_id, 
      S.schedule_date, 
      A.slot_number, 
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
          patient P ON A.patient_id = P.patient_id
      JOIN 
          schedule S ON A.schedule_id = S.schedule_id
      JOIN 
          staff ST ON S.staff_id = ST.staff_id
      JOIN 
          department D ON ST.department_id = D.department_id
      LEFT JOIN 
          treatment_record T ON A.appointment_id = T.appointment_id
      WHERE 
          P.email = ?
      GROUP BY 
          A.appointment_id, S.schedule_date, A.slot_number, ST.first_name, ST.last_name, ST.gender, ST.job_type, D.department_name
      `;

      let countQuery = 
        `SELECT COUNT(*) as total
        FROM appointment A
        JOIN patient P ON A.patient_id = P.patient_id
        WHERE P.email = ?`;

      let queryParams = [email, limit, offset];
      let countParams = [email];
  

      // Append LIMIT and OFFSET based on the condition
      if (status) {
      query += ` AND A.status = ? LIMIT ? OFFSET ?`;
      queryParams = [email, status, limit, offset];

      countQuery += ` AND A.status = ?`;
      countParams = [email, status];
      } else {
      query += ` LIMIT ? OFFSET ?`;
      queryParams = [email, limit, offset];
      }

      const [results] = await mysqlClient.poolPatient.query(query, queryParams);
      const [countResult] = await mysqlClient.poolPatient.query(countQuery, countParams);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        results: results,
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
      const { patientID, doctorID, date, slotNumber, purpose } = req.body;

      if(!patientID || !doctorID || !date || !slotNumber){
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
      }
      
      const query = `CALL book_an_appointment(?,?,?,?,?, @result, @message)`;
      const [rows] = await mysqlClient.poolPatient.query(query, [patientID, doctorID, date, slotNumber, purpose]);

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

  cancelAppointment: async (req, res, next) => {
    try {
      const { appointment_id, patient_id} = req.body;

      if(!appointment_id || !patient_id){
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
      }

      const query = `CALL cancel_appointment(?,?, @result, @message)`;
      const [rows] = await mysqlClient.poolPatient.query(query, [appointment_id,patient_id]);
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
      console.log('Error fetching appointments:', error);
      next(error);
    }
  }
// <<<<<<< HEAD
//   cancelAppointment: async (req, res, next) => {
//     try {
//       const { appointment_id, patient_id} = req.body;

//       if(!appointment_id || !patient_id){
// =======
//   updateAppointment: async (req, res) => {
//     try {
//       const { appointmentId, date, timeSlot } = req.body;

//       if(!appointmentId || !date || !timeSlot){
// >>>>>>> main
//         return res
//           .status(httpStatus.BAD_REQUEST().code)
//           .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
//       }
      
// <<<<<<< HEAD
//       const query = `CALL cancel_appointment(?,?, @result, @message)`;
//       const [rows] = await mysqlClient.poolPatient.query(query, [appointment_id,patient_id]);
// =======
//       const query = `CALL update_appointment(?,?,?, @result, @message)`;
//       const [rows] = await mysqlClient.poolStaff.query(query, [appointmentId,date,timeSlot]);
// >>>>>>> main
//       // If there are multiple result sets, select the last one
//       const result = rows[0][0].result;
//       const message = rows[0][0].message;
      
//       if (result == 0) {
// <<<<<<< HEAD
//         throw new Error(message);
// =======
//         return res
//           .status(httpStatus.BAD_REQUEST().code)
//           .json({ error: httpStatus.BAD_REQUEST(message).message });
// >>>>>>> main
//       }

//       return res  
//           .status(httpStatus.OK().code)
//           .json({ message: message });
//     } catch (error) {
// <<<<<<< HEAD
//       console.log('Error fetching appointments:', error);
//       next(error);
//     }
//   }
// =======
//       console.error('Error fetching appointments:', error);
//       res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({ 
//         error: httpStatus.INTERNAL_SERVER_ERROR.message 
//       });
//     }
//   },
// >>>>>>> main
};

module.exports = appointmentController;
