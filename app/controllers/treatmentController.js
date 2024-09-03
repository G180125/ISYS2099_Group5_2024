const express = require("express");
const cookieParser = require("cookie-parser");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");
const mysqlClient = require("../databases/mysqlClient.js");

const app = express();
app.use(cookieParser());

const treatment_list = ["hormone therapy", "chemotherapy"]

const treatmentController = {
    getMyTreatments: async (req, res, next) => {
        try{
            const status = req.query.status;
            const id = req.id;
            const role = req.role;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            let query = `
                SELECT *
                FROM treatment_report
                WHERE patient_id = ?`;

            let countQuery = `
                SELECT COUNT(*) as total
                FROM treatment_report
                WHERE patient_id = ?`;

            let queryParams = [id, limit, offset];
            let countParams = [id];

            if (status) {
                query += ` AND A.status = ? LIMIT ? OFFSET ?`;
                queryParams = [id, status, limit, offset];

                countQuery += ` AND A.status = ?`;
                countParams = [id, status];
            } else {
                query += ` LIMIT ? OFFSET ?`;
            }

            const pool = mysqlClient.getPool(role);

            const [results] = await pool.query(query, queryParams);
            const [countResult] = await pool.query(countQuery, countParams);

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

    getTreatmentsByPatient: async (req, res, next) => {
        try{
            const status = req.query.status;
            const id = req.body.id;
            const role = req.role;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            let query = `
                SELECT *
                FROM treatment_report
                WHERE patient_id = ?`;

            let countQuery = `
                SELECT COUNT(*) as total
                FROM treatment_report
                WHERE patient_id = ?`;

            let queryParams = [id, limit, offset];
            let countParams = [id];

            if (status) {
                query += ` AND treatment_status = ? LIMIT ? OFFSET ?`;
                queryParams = [id, status, limit, offset];

                countQuery += ` AND treatment_status = ?`;
                countParams = [id, status];
            } else {
                query += ` LIMIT ? OFFSET ?`;
            }

            const pool = mysqlClient.getPool(role);

            const [results] = await pool.query(query, queryParams);
            const [countResult] = await pool.query(countQuery, countParams);

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

    getTreatmentById: async (req, res, next) => {
        try{
            const role = req.role;
            const status = req.query.status;
            const treatmentId = req.body.treatmentId;

            let query = `
                SELECT *
                FROM treatment_record
                WHERE treatment_id = ?`;

            let queryParams = [treatmentId];
            
            if(status){
                query += ` AND treatment_status = ?`;
                queryParams = [treatmentId, status];
            }

            const pool = mysqlClient.getPool(role);

            const [result] = await pool.query(query, queryParams);

            return res 
                    .status(httpStatus.OK().code)
                    .json({ result: result });
        } catch (error) {
            return next(error);
        }
    },

    addTreatment: async (req, res, next)=>{
        try{
            const role = req.role;
            const { treatment_name, treatment_date, appointment_id } = req.body;
            console.log(treatment_name);
            console.log(treatment_date);
            console.log(appointment_id)
            if(!treatment_name || !treatment_date || !appointment_id){
                return res
                        .status(httpStatus.BAD_REQUEST().code)
                        .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
            }

            if(!treatment_list.includes(treatment_name.toLowerCase())){
                return res
                .status(httpStatus.BAD_REQUEST().code)
                .json({error: httpStatus.BAD_REQUEST("Invalid treatment!").message});
            }

            const pool = mysqlClient.getPool(role);

            const query = `CALL add_patient_treatment(?,?,?, @result, @message)`;
            const [rows] = await pool.query(query, [treatment_name,treatment_date,appointment_id]);
            const result = rows[0][0].result;
            const message = rows[0][0].message;
            console.log(rows);

            if (result == 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code)
                  .json({ error: httpStatus.BAD_REQUEST(message).message });
              }

            return res
                .status(httpStatus.OK().code)
                .json({ message: message });
            }
        catch(err){
            return next(err);
        }
    },
};

module.exports = treatmentController;