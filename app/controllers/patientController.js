const express = require("express");
const cookieParser = require("cookie-parser");
const mysqlClient = require("../databases/mysqlClient");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");
const mysqlService = require("../services/mysqlService");
const { configDotenv } = require("dotenv");

const app = express();
app.use(cookieParser());

const validGenders = ["f", "m", "o"];

const patientController = {
    getAllPatients: async (req, res, next) => {
      try {
        const role = req.role;
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;

        const pool = mysqlClient.getPool(role);
  
        // Query to fetch patients with pagination
        const [results] = await pool.query(`SELECT * FROM patient_secure_report LIMIT ? OFFSET ?`, [limit, offset]);
  
        // Optionally, fetch the total number of records for pagination metadata
        const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM patient_secure_report`);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);
  
        res.json({
          results: results,
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

    getMyInfo: async (req, res, next) => {
      try {
        const id = req.id;
        const role = req.role;
        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
        }

        const pool = mysqlClient.getPool(role);

        const [results] = await pool.query(
          `SELECT 
          P.user_id patient_id,
          U.first_name,
          U.last_name,
          U.email,
          P.date_of_birth,
          U.gender,
          P.allergies
            FROM patient P
            JOIN user U ON U.user_id = P.user_id WHERE U.user_id = ?`,
          [id],
        );
        if (results.length === 0) {
          return res
            .status(httpStatus.NOT_FOUND().code)
            .json({ error: httpStatus.NOT_FOUND("No patient found").message });
        }

        return res.json(results[0]);
      } catch (error) {
        return next(error);
      }
    },

    getPatientByID: async (req, res, next) => {
      try {
        const id = req.params.id;
        const role = req.role;
        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
        }

        const pool = mysqlClient.getPool(role);

        const [results] = await pool.query(
          `SELECT * FROM patient_secure_report WHERE patient_id = ?`,
          [id],
        );
        if (results.length === 0) {
          return res
            .status(httpStatus.NOT_FOUND().code)
            .json({ error: httpStatus.NOT_FOUND("No patient found").message });
        }

        return res.json(results[0]);
      } catch (error) {
        return next(error);
      }
    },
  
    getPatientByname: async (req, res, next) => {
      try {
        console.log('wtf???');
        const first_name = req.query.first_name;
        const last_name = req.query.last_name;
        const role = req.role;
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

        console.log("first name : ",first_name);
        console.log("last name : ",last_name);

        const pool = mysqlClient.getPool(role);
    
        const query = `CALL search_patient_by_name(?, ?, ?, ?)`;
        const [results] = await pool.query(query, [first_name, last_name, limit, offset]); 

        if (results.length === 0) {
          return res
            .status(httpStatus.NOT_FOUND().code)
            .json({ error: httpStatus.NOT_FOUND("No patient found").message });
        }
    
        return res.json({
          results: results[0],
        });
      } catch (error) {
        return next(error);
      }
    },
  
    updateMyInfo: async (req, res, next) => {
      try {
        const id = req.id;
        const role = req.role;
        const {  newFirstName, newLastName, newDOB, newGender, allergies } = req.body;

        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
        }

        const pool = mysqlClient.getPool(role);

        const user = await mysqlService.getPatientByID(id);
        if (!user) {
          return res
            .status(httpStatus.UNAUTHORIZED().code)
            .json({ error: httpStatus.UNAUTHORIZED("No patient found").message });
        }
  
        const [rows] = await pool.query(
          `CALL update_patient(?, ?, ?, ?, ?, ?, @result, @message);`,
          [id, newFirstName, newLastName, newGender, newDOB, allergies] 
        );
    
        const result = rows[0][0].result; 
        const message = rows[0][0].message;
    
        if(result == 0){
          return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: message });
        }

        return res.status(httpStatus.OK().code).json({ results: message });
      } catch (error) {
        return next(error);
      }
    },
  
    deletePatientById: async (req, res, next) => {
      try {
        const id = req.body.id;
        const role = req.role;
        if(!id || id == ""){
            return res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No Input For Id").message });
        }

        const pool = mysqlClient.getPool(role);

        const user = await mysqlService.getPatientByID(id);
        if (!user) {
          return res
            .status(httpStatus.UNAUTHORIZED().code)
            .json({ error: httpStatus.UNAUTHORIZED("No patient found").message });
        }

        await pool.query(`DELETE FROM user WHERE user_id = ?`, [
          id,
        ]);
        res
          .status(httpStatus.OK().code)
          .json(httpStatus.OK(`Patient member deleted successfully`).data);
      } catch (error) {
        return next(error);
      }
    },
};
  
  module.exports = patientController;