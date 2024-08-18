DROP PROCEDURE IF EXISTS register_patient;
-- DELIMITER //
CREATE PROCEDURE register_patient(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_email VARCHAR(100),
    in p_password VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('M', 'F', 'O'),
    IN p_allergies TEXT
)
this_proc:
BEGIN
    START TRANSACTION;

    IF p_date_of_birth > CURDATE() THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    INSERT INTO patient (first_name, last_name, email, password, date_of_birth, gender, allergies)
    VALUES (p_first_name, p_last_name, p_email, p_password, p_date_of_birth, p_gender, p_allergies);

    COMMIT;

    SELECT LAST_INSERT_ID() AS new_patient_id;
END; -- //
-- DELIMITER ;


DROP PROCEDURE IF EXISTS search_patient_by_name;
-- DELIMITER //
CREATE PROCEDURE search_patient_by_name(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT * FROM patient
    WHERE (p_first_name IS NULL OR first_name LIKE CONCAT('%', p_first_name, '%'))
    AND (p_last_name IS NULL OR last_name LIKE CONCAT('%', p_last_name, '%'))
    LIMIT p_limit OFFSET p_offset;
END; -- //
-- DELIMITER ;


/*DELIMITER //
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

    SELECT COUNT(*) INTO is_doctor 
    FROM staff 
    WHERE staff_id = p_doctor_id AND job_type = 'D';

    IF is_doctor = 0 THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    IF p_treatment_date > CURDATE() THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    INSERT INTO treatment_history (patient_id, treatment, treatment_date, doctor_id)
    VALUES (p_patient_id, p_treatment, p_treatment_date, p_doctor_id);

    COMMIT;
END //
DELIMITER ;*/



