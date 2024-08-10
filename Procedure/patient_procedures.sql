----------------------- Procedure to register a new patient -----------------------
/*
Description:
This stored procedure registers a new patient in the system by inserting their details into the patient table.
*/
DROP PROCEDURE IF EXISTS register_patient;
DELIMITER //
CREATE PROCEDURE register_patient(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('M', 'F', 'O'),
    IN p_allergies TEXT
)
this_proc:
BEGIN
    START TRANSACTION;

    -- Check if the input birthday is after today
    IF p_date_of_birth > CURDATE() THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- If the date is valid, register the new patient
    INSERT INTO patient (first_name, last_name, date_of_birth, gender, allergies)
    VALUES (p_first_name, p_last_name, p_date_of_birth, p_gender, p_allergies);

    COMMIT;

    SELECT LAST_INSERT_ID() AS new_patient_id;
END //
DELIMITER ;


---------------------- Procedure to search patient by name ----------------------
/*
Description:
This stored procedure searches for a patient by their first and last names. It first checks if any matching patient records exist. 
If no matching records are found, the result is set to 0. If one or more records are found, the procedure returns the patient details 
and sets the result to 1.
*/
DROP PROCEDURE IF EXISTS search_patient_by_name;
DELIMITER //
CREATE PROCEDURE search_patient_by_name(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
)
BEGIN
    SELECT * FROM patient
    WHERE first_name = p_first_name AND last_name = p_last_name;
END //
DELIMITER ;

------------------------ Procedure to add a treatment ------------------------
/*
Description:
This stored procedure adds a treatment record to a patient's treatment history. 
*/
DELIMITER //
CREATE PROCEDURE add_treatment(
    IN p_patient_id INT,
    IN p_treatment TEXT,
    IN p_treatment_date DATE,
    IN p_doctor_id INT,
)
this_proc:
BEGIN
    DECLARE is_doctor INT;

    START TRANSACTION;

    -- Check if the staff member is a doctor
    SELECT COUNT(*) INTO is_doctor 
    FROM staff 
    WHERE staff_id = p_doctor_id AND job_type = 'D';

    IF is_doctor = 0 THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Check if the treatment day is after today
    IF p_treatment_date > CURDATE() THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- If all checks pass, insert the treatment record
    INSERT INTO treatment_history (patient_id, treatment, treatment_date, doctor_id)
    VALUES (p_patient_id, p_treatment, p_treatment_date, p_doctor_id);

    COMMIT;
END //
DELIMITER ;

------------------------ Procedure to add a custom object ------------------------


