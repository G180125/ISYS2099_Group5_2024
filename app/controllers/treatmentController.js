const express = require("express");
const cookieParser = require("cookie-parser");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");
const mysqlClient = require("../databases/mysqlClient.js");

const app = express();
app.use(cookieParser());

const treatment_list = ["hormone therapy", "chemotherapy"]

const treatmentController = {
    getMyTreatments: async (req, res) => {
        try{
            const status = req.query.status;
            const id = req.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            let query = `
                SELECT  P.first_name AS patient_first_name, P.last_name AS patient_last_name, 
                        T.treatment_name, T.treatment_date, ST.first_name AS staff_first_name, 
                        ST.last_name AS staff_last_name, ST.email AS staff_email, 
                        ST.job_type, D.department_name
                FROM treatment_record T
                JOIN appointment A ON T.appointment_id = A.appointment_id
                JOIN patient P ON A.patient_id = P.patient_id
                JOIN schedule S ON A.schedule_id = S.schedule_id
                JOIN staff ST ON S.staff_id = ST.staff_id
                JOIN department D ON ST.department_id = D.department_id
                WHERE P.patient_id = ?`;

            let countQuery = `
                SELECT COUNT(*) as total
                FROM appointment A
                JOIN patient P ON A.patient_id = P.patient_id
                WHERE P.email = ?`;

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

    getTreatmentsByPatient: async (req, res) => {
        try{
            const status = req.query.status;
            const id = req.body.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            let query = `
                SELECT  P.first_name AS patient_first_name, P.last_name AS patient_last_name, 
                        T.treatment_name, T.treatment_date, ST.first_name AS staff_first_name, 
                        ST.last_name AS staff_last_name, ST.email AS staff_email, 
                        ST.job_type, D.department_name
                FROM treatment_record T
                JOIN appointment A ON T.appointment_id = A.appointment_id
                JOIN patient P ON A.patient_id = P.patient_id
                JOIN schedule S ON A.schedule_id = S.schedule_id
                JOIN staff ST ON S.staff_id = ST.staff_id
                JOIN department D ON ST.department_id = D.department_id
                WHERE P.patient_id = ?`;

            let countQuery = `
                SELECT COUNT(*) as total
                FROM appointment A
                JOIN patient P ON A.patient_id = P.patient_id
                WHERE P.email = ?`;

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

    getTreatmentById: async (req, res) => {
        try{
            const status = req.query.status;
            const treatmentId = req.body.treatmentId;

            let query = `
                SELECT  T.treatment_name, T.treatment_date, ST.first_name AS staff_first_name, 
                        ST.last_name AS staff_last_name, 
                        P.first_name AS patient_first_name, P.last_name AS patient_last_name,
                        ST.job_type, D.department_name
                FROM treatment_record T
                JOIN appointment A ON T.appointment_id = A.appointment_id
                JOIN patient P ON A.patient_id = P.patient_id
                JOIN schedule S ON A.schedule_id = S.schedule_id
                JOIN staff ST ON S.staff_id = ST.staff_id
                JOIN department D ON ST.department_id = D.department_id
                WHERE T.treatment_id = ?`;

            const [result] = await mysqlClient.poolPatient.query(query, [treatmentId]);

            return res 
                    .status(httpStatus.OK().code)
                    .json({ result: result });
            } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({ 
                error: httpStatus.INTERNAL_SERVER_ERROR.message 
            });
        }
    },

    addTreatment: async (req, res)=>{
        try{
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

            const query = `CALL add_patient_treatment(?,?,?, @result, @message)`;
            const [rows] = await mysqlClient.poolStaff.query(query, [treatment_name,treatment_date,appointment_id]);
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
            console.error("error: " + err.stack);
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    },
};

module.exports = treatmentController;