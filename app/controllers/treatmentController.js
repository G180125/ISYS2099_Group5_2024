const express = require("express");
const cookieParser = require("cookie-parser");
const { db } = require("../models");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");


const app = express();
app.use(cookieParser());

const treatment_list = ["hormone therapy", "chemotherapy"]


const treatmentController = {
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
            const [rows] = await db.poolStaff.query(query, [treatment_name,treatment_date,appointment_id]);
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