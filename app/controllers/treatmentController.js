const httpStatus = require("../utils/httpStatus.js");
const mysqlClient = require("../databases/mysqlClient.js");

const treatmentRecordController = {
    getAllTreatments: async (req, res, next) => {
        try{
            const role = req.role;

            const pool = mysqlClient.getPool(role);

            const [results] = await pool.query(`SELECT * FROM treatment`);
           
            res.json({
                results: results
            });
        } catch (error) {
            return next(error);
        } 
    },
    
    getTreatmentById: async (req, res, next) => {
        try{
            const role = req.role;
            const id = req.params.id;

            const pool = mysqlClient.getPool(role);

            const [results] = await pool.query(`SELECT * FROM treatment WHERE treatment_id = ?`, [id]);
           
            if (results.length === 0) {
                return res
                  .status(httpStatus.NOT_FOUND().code)
                  .json({ error: httpStatus.NOT_FOUND("Treatment not found").message });
              }

            res.json({
                results: results
            });
        } catch (error) {
            return next(error);
        } 
    },

    addTreatment: async (req, res, next) => {
        try{
            const role = req.role;
            const { treatment_name, treatment_cost } = req.body;

            if(!treatment_name || !treatment_cost){
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({error: httpStatus.BAD_REQUEST("Invalid number of inputs").message});
            }

            const pool = mysqlClient.getPool(role);

            const [results] = await pool.query(`INSERT INTO treatment(treatment_name, treatment_cost) VALUES (?, ?);`, [treatment_name, treatment_cost]);

            if (results.affectedRows === 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code) 
                  .json({ error: "Something Wrong! Please try again!" });
            }
           
            res.json({
                message : 'Add Treatment Successfully'
            });
        } catch (error) {
            return next(error);
        } 
    },

    updateTreatment: async (req, res, next) => {
        try{
            const role = req.role;
            const { treatment_id, treatment_name, treatment_cost } = req.body;

            if (!treatment_id) {
                return res
                    .status(httpStatus.NOT_FOUND().code)
                    .json({ error: "No Treatement Id Found" });
            }

            // Check if both treatment_name and treatment_cost are null
            if (!treatment_name && !treatment_cost) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: "At least one attribute (treatment_name or treatment_cost) must be provided." });
            }
    
            const pool = mysqlClient.getPool(role);
    
            // Dynamically build the query based on provided attributes
            let updateQuery = 'UPDATE treatment SET';
            const queryParams = [];
            
            if (treatment_name) {
                updateQuery += ' treatment_name = ?,';
                queryParams.push(treatment_name);
            }
    
            if (treatment_cost) {
                updateQuery += ' treatment_cost = ?,';
                queryParams.push(treatment_cost);
            }
    
            // Remove trailing comma and add WHERE clause
            updateQuery = updateQuery.slice(0, -1); // Remove the last comma
            updateQuery += ' WHERE treatment_id = ?';
            queryParams.push(treatment_id);
    
            // Execute the update query
            const [results] = await pool.query(updateQuery, queryParams);
    
            // Check if any rows were updated
            if (results.affectedRows === 0) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: "No treatment Updated!" });
            }
    
            return res
                .status(httpStatus.OK().code)
                .json({ message: "Department updated successfully." });
        } catch (error) {
            return next(error);
        } 
    }
};

module.exports = treatmentRecordController;