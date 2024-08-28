DROP VIEW IF EXISTS all_patient_treatment_history;
CREATE VIEW all_patient_treatment_history AS
SELECT 
    history_id,
    treatment_name,
    treatment_date,
    appointment_id,
    status
FROM 
    treatment_record;


-- View a patient treatment for a given duration
DROP PROCEDURE IF EXISTS view_patient_treatment_for_given_duration;
CREATE PROCEDURE view_patient_treatment_for_given_duration(
    IN p_date DATE
)
BEGIN
    SELECT * 
    FROM treatment_record
    WHERE treatment_date = p_date;
END;


-- View all patient treatment in a given duration
DROP PROCEDURE IF EXISTS view_patient_treatment_in_given_duration;
CREATE PROCEDURE view_patient_treatment_in_given_duration(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT * 
    FROM treatment_record
    WHERE treatment_date BETWEEN p_start_date AND p_end_date;
END;



-- View job change history of a staff (need relation)
-- View the work of a doctor in a given duration (need relation)
-- View the work of all doctors in a given duration (need relation)