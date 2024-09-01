const express = require("express");
const cookieParser = require("cookie-parser");
const mysqlClient = require("../databases/mysqlClient");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");
const mysqlService = require("../services/mysqlService");

const app = express();
app.use(cookieParser());

const validGenders = ["f", "m", "o"];

const patientController = {
    getAllPatients: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;
  
        // Query to fetch patients with pagination
        const [results] = await mysqlClient.poolAdmin.query(`SELECT * FROM patient_secure_view LIMIT ? OFFSET ?`, [limit, offset]);
  
        // Optionally, fetch the total number of records for pagination metadata
        const [countResult] = await mysqlClient.poolAdmin.query(`SELECT COUNT(*) as total FROM patient_secure_view`);
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

    getMyInfo: async (req, res) => {
      try {
        const id = req.id;

        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
        }

        const [results] = await mysqlClient.poolPatient.query(
          `SELECT * FROM patient_secure_view WHERE patient_id = ?`,
          [id],
        );
        if (results.length === 0) {
          return res
            .status(httpStatus.NOT_FOUND().code)
            .json({ error: httpStatus.NOT_FOUND("No patient found").message });
        }

        return res.json(results[0]);
      } catch (error) {
        console.error(error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
      }
    },

    getPatientByID: async (req, res) => {
      try {
        const id = req.body.id;

        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
        }

        const [results] = await mysqlClient.poolPatient.query(
          `SELECT * FROM patient_secure_view WHERE patient_id = ?`,
          [id],
        );
        if (results.length === 0) {
          return res
            .status(httpStatus.NOT_FOUND().code)
            .json({ error: httpStatus.NOT_FOUND("No patient found").message });
        }

        return res.json(results[0]);
      } catch (error) {
        console.error(error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
      }
    },
  
    getPatientByname: async (req, res) => {
      try {
        const first_name = req.query.first_name;
        const last_name = req.query.last_name;
        console.log(`first name: ${first_name}`);
        console.log(`last name: ${last_name}`);
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;
    
        if (!first_name && !last_name) {
          return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Please provide the patient name for searching!").message });
        }
    
        const query = `CALL search_patient_by_name(?, ?, ?, ?)`;
        const [results] = await mysqlClient.poolPatient.query(query, [first_name, last_name, limit, offset]); 

        if (results.length === 0) {
          return res
            .status(httpStatus.NOT_FOUND().code)
            .json({ error: httpStatus.NOT_FOUND("No patient found").message });
        }
    
        // Fetch total number of matching records for pagination metadata
        const countQuery = `SELECT COUNT(*) as total FROM patient_secure_view WHERE first_name = ? AND last_name = ?`;
        const [countResult] = await mysqlClient.poolPatient.query(countQuery, [first_name, last_name]);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);
    
        return res.json({
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
  
    updatePatient: async (req, res) => {
      try {
        const id = req.id;
        const {  newFirstName, newLastName, newDOB, newGender } = req.body;

        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
        }

        const user = await mysqlService.getPatientByID(id);
        if (!user) {
          return res
            .status(httpStatus.UNAUTHORIZED().code)
            .json({ error: httpStatus.UNAUTHORIZED("No patient found").message });
        }
  
        // Validate DOB (not after today)
        if (newDOB && !moment(newDOB, 'YYYY-MM-DD', true).isBefore(moment())) {
          return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("The date of birth must be a valid date and not in the future").message });
        }
  
        // Validate gender
        if (newGender && !validGenders.includes(newGender.toLowerCase())) {
          return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Gender must be 'female', 'male', or 'other'").message });
        }

        // Prepare update query based on provided fields
        let updateQuery = 'UPDATE patient SET ';
        const updateFields = [];
        const updateValues = [];
  
        if (newFirstName) {
          updateFields.push('first_name = ?');
          updateValues.push(newFirstName);
        }
        if (newLastName) {
          updateFields.push('last_name = ?');
          updateValues.push(newLastName);
        }
        if (newDOB) {
          updateFields.push('date_of_birth = ?');
          updateValues.push(newDOB);
        }
        if (newGender) {
          updateFields.push('gender = ?');
          updateValues.push(newGender);
        }
  
        if (updateFields.length > 0) {
          updateQuery += updateFields.join(', ') + ' WHERE patient_id = ?';
          updateValues.push(id);
  
          await mysqlClient.poolPatient.query(updateQuery, updateValues);
  
          res.json({
            message: `Patient updated successfully`,
            first_name: newFirstName,
            last_name: newLastName,
            dob: newDOB,
            gender: newGender,
            role: "patient",
          });
        } else {
          res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No valid fields provided for update").message });
        }
  
      } catch (error) {
        console.error(error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
      }
    },
  
    deletePatientByEmail: async (req, res) => {
      try {
        const id = req.body.id;

        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No Input For Id").message });
        }

        const user = await mysqlService.getPatientByID(id);
        if (!user) {
          return res
            .status(httpStatus.UNAUTHORIZED().code)
            .json({ error: httpStatus.UNAUTHORIZED("No patient found").message });
        }

        await mysqlClient.poolAdmin.query(`DELETE FROM patient WHERE patient_id = ?`, [
          id,
        ]);
        res
          .status(httpStatus.OK().code)
          .json(httpStatus.OK(`Patient member deleted successfully`).data);
      } catch (error) {
        console.error(error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
      }
    },
};
  
  module.exports = patientController;