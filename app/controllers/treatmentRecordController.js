const httpStatus = require("../utils/httpStatus.js");
const mysqlClient = require("../databases/mysqlClient.js");

const treatmentRecordController = {
    getMyTreatmentRecords: async (req, res, next) => {
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

    getTreatmentRecordsByAppointment: async (req, res, next) => {
        try{
            const status = req.query.status;
            const id = req.params.id;
            const role = req.role;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            let query = `
                SELECT *
                FROM treatment_report
                WHERE appointment_id = ?`;

            let countQuery = `
                SELECT COUNT(*) as total
                FROM treatment_report
                WHERE appointment_id = ?`;

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

    getTreatmentRecordsByPatient: async (req, res, next) => {
        try{
            const status = req.query.status;
            const id = req.params.id;
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

    getTreatmentRecordById: async (req, res, next) => {
        try{
            const role = req.role;
            const status = req.query.status;
            const treatmentId = req.params.id;

            let query = `
                SELECT *
                FROM treatment_record
                WHERE record_id = ?`;

            let queryParams = [treatmentId];
            
            if(status){
                query += ` AND treatment_status = ?`;
                queryParams = [treatmentId, status];
            }

            const pool = mysqlClient.getPool(role);

            const [result] = await pool.query(query, queryParams);
            
            if (result.length === 0) 
                throw new Error("No matching treatment record found.");
            
            return res 
                    .status(httpStatus.OK().code)
                    .json({result : result[0]});
        } catch (error) {
            return next(error);
        }
    },

    addTreatmentRecord: async (req, res, next)=>{
        try{
            const role = req.role;
            const { treatment_id, treatment_date, appointment_id } = req.body;

            if(!treatment_id || !treatment_date || !appointment_id){
                return res
                        .status(httpStatus.BAD_REQUEST().code)
                        .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
            }

            const pool = mysqlClient.getPool(role);

            const query = `CALL add_patient_treatment(?,?,?, @result, @message)`;
            const [rows] = await pool.query(query, [treatment_id,treatment_date,appointment_id]);
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

    markTreatmentRecordAsMissing: async (req, res, next)=>{
        try{
            const role = req.role;
            const record_id = req.params.id;

            if(!record_id){
                return res
                        .status(httpStatus.BAD_REQUEST().code)
                        .json({error: httpStatus.BAD_REQUEST("No Input For Treatment Record").message});
            }

            const pool = mysqlClient.getPool(role);

            const query = `UPDATE treatment_record SET status = 'M' WHERE record_id = ? AND status = 'U' `;
            const [result] = await pool.query(query, [record_id]);

            if (result.affectedRows === 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code) 
                  .json({ error: "No matching treatment record found or record is not in 'U' (upcoming) status." });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: 'Change Treatmemt Record Successfully' });
            }
        catch(err){
            return next(err);
        }
    },

    finishTreatmentRecord: async (req, res, next)=>{
        try{
            const role = req.role;
            const record_id = req.params.id;

            if(!record_id){
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({error: httpStatus.BAD_REQUEST("No Input For Treatment Record").message});
            }

            const pool = mysqlClient.getPool(role);

            const query = `UPDATE treatment_record SET status = 'F' WHERE record_id = ? AND status = 'U'`;
            const [result] = await pool.query(query, [record_id]);

            if (result.affectedRows === 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code) 
                  .json({ error: "No matching treatment record found or record is not in 'U' (upcoming) status." });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: 'Finish Treatmemt Record Successfully' });
            }
        catch(err){
            return next(err);
        }
    },
};

module.exports = treatmentRecordController;