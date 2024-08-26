const express = require("express");
const cookieParser = require("cookie-parser");
const { db, models } = require("../models");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

const validGenders = ["F", "M", "O"];

const patientController = {
    getAllPatients: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;
  
        // Query to fetch patients with pagination
        const [results] = await db.poolAdmin.query(`SELECT * FROM patient LIMIT ? OFFSET ?`, [limit, offset]);
  
        // Optionally, fetch the total number of records for pagination metadata
        const [countResult] = await db.poolAdmin.query(`SELECT COUNT(*) as total FROM patient`);
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

    getPatientByEmail: async (req, res) => {
      try {
        const email = req.body.email;

        if(!email || email == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No Input For Email").message });
        }

        const [results] = await db.poolPatient.query(
          `SELECT * FROM patient WHERE email = ?`,
          [email],
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
        const [results] = await db.poolPatient.query(query, [first_name, last_name, limit, offset]); 

        if (results.length === 0) {
          return res
            .status(httpStatus.NOT_FOUND().code)
            .json({ error: httpStatus.NOT_FOUND("No patient found").message });
        }
    
        // Fetch total number of matching records for pagination metadata
        const countQuery = `SELECT COUNT(*) as total FROM patient WHERE first_name = ? AND last_name = ?`;
        const [countResult] = await db.poolPatient.query(countQuery, [first_name, last_name]);
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
      console.log(req.params);
      try {
        const { email, newFirstName, newLastName, newDOB, newGender } = req.body;

        if(!email || email == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No Input For Email").message });
        }

        const user = await models.getPatient(email);
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
          updateFields.push('dob = ?');
          updateValues.push(newDOB);
        }
        if (newGender) {
          updateFields.push('gender = ?');
          updateValues.push(newGender);
        }
  
        if (updateFields.length > 0) {
          updateQuery += updateFields.join(', ') + ' WHERE email = ?';
          updateValues.push(email);
  
          await db.poolPatient.query(updateQuery, updateValues);
  
          res.json({
            message: `Patient ${email} updated successfully`,
            email: email,
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
        const email = req.body.email;

        if(!email || email == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No Input For Email").message });
        }

        const user = await models.getPatient(email);
        if (!user) {
          return res
            .status(httpStatus.UNAUTHORIZED().code)
            .json({ error: httpStatus.UNAUTHORIZED("No patient found").message });
        }

        await db.poolAdmin.query(`DELETE FROM patient WHERE email = ?`, [
          email,
        ]);
        res
          .status(httpStatus.OK().code)
          .json(httpStatus.OK(`Patient member ${email} deleted successfully`, email).data);
      } catch (error) {
        console.error(error);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
      }
    },
};
  
  module.exports = patientController;