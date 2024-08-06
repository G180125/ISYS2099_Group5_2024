----------------------- Procedure to register a new patient -----------------------
/*
OUT result:
    0: SQLEXCEPTION
    1: Success

Description:
This stored procedure registers a new patient in the system by inserting their details into the patient table. If an SQL exception occurs 
during the process, the result is set to 0. If the insertion is successful, the result is set to 1.
*/
DELIMITER //
CREATE PROCEDURE register_patient(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('M', 'F', 'O'),
    IN p_allergies TEXT,
    OUT result INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET result = 0;

    INSERT INTO patient (first_name, last_name, date_of_birth, gender, allergies)
    VALUES (p_first_name, p_last_name, p_date_of_birth, p_gender, p_allergies);

    SET result = 1;
END //
DELIMITER ;

---------------------- Procedure to search patient by name ----------------------
/*
OUT result:
    0: No patient found
    1: Success

Description:
This stored procedure searches for a patient by their first and last names. It first checks if any matching patient records exist. 
If no matching records are found, the result is set to 0. If one or more records are found, the procedure returns the patient details 
and sets the result to 1.
*/
DELIMITER //
CREATE PROCEDURE search_patient_by_name(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    OUT result INT
)
BEGIN
    DECLARE patient_exists INT;

    -- Check if there are any matching patients
    SELECT COUNT(*) INTO patient_exists
    FROM patient
    WHERE first_name = p_first_name AND last_name = p_last_name;

    IF patient_exists = 0 THEN
        SET result = 0;
    ELSE
        SET result = 1;
        -- Return the patient record(s)
        SELECT * FROM patient
        WHERE first_name = p_first_name AND last_name = p_last_name;
    END IF;
END //
DELIMITER ;

------------------------ Procedure to add a treatment ------------------------
/*
OUT result:
    -1: This staff is not a doctor
    0: No patient found
    1: Success

Description:
This stored procedure adds a treatment record to a patient's treatment history. It first checks if the patient exists and if the 
staff member administering the treatment is a doctor. If the patient does not exist, the result is set to 0. If the staff member is 
not a doctor, the result is set to -1. If both checks pass, the treatment record is inserted, and the result is set to 1.
*/
DELIMITER //
CREATE PROCEDURE add_treatment(
    IN p_patient_id INT,
    IN p_treatment TEXT,
    IN p_treatment_date DATE,
    IN p_doctor_id INT,
    OUT result INT
)
BEGIN
    DECLARE patient_exists INT;
    DECLARE is_doctor INT;

    -- Check if the patient exists
    SELECT COUNT(*) INTO patient_exists 
    FROM patient 
    WHERE patient_id = p_patient_id;

    IF patient_exists = 0 THEN
        SET result = 0;
        RETURN;
    END IF;

    -- Check if the staff member is a doctor
    SELECT COUNT(*) INTO is_doctor 
    FROM staff 
    WHERE staff_id = p_doctor_id AND job_type = 'D';

    IF is_doctor = 0 THEN
        SET result = -1;
        RETURN;
    END IF;

    -- If all checks pass, insert the treatment record
    INSERT INTO treatment_history (patient_id, treatment, treatment_date, doctor_id)
    VALUES (p_patient_id, p_treatment, p_treatment_date, p_doctor_id);

    SET result = 1;
END //
DELIMITER ;

------------------------ Procedure to add a custom object ------------------------


