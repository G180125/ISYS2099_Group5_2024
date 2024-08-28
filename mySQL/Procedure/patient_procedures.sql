/*
    OUT result:
        0: Fail
        1: Success
*/
DROP PROCEDURE IF EXISTS register_patient;
CREATE PROCEDURE register_patient(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('M', 'F', 'O'),
    IN p_allergies TEXT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);
    
    -- Declare the handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET _rollback = 1;
        SET result = 0;
        SET message = sql_error_message;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Check if the date of birth is in the future
    IF p_date_of_birth > CURDATE() THEN
        SET result = 0;
        SET message = 'Date of birth cannot be in the future';
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Insert the new patient record
    INSERT INTO patient (first_name, last_name, email, password, date_of_birth, gender, allergies)
    VALUES (p_first_name, p_last_name, p_email, p_password, p_date_of_birth, p_gender, p_allergies);

    -- Final check before committing the transaction
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET message = 'Registration successful';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;

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


DROP PROCEDURE IF EXISTS `add_patient_treatment`;
CREATE PROCEDURE add_patient_treatment(
	IN t_treatment_name VARCHAR(100),
	IN t_treatment_date DATE,
	IN t_appointment_id INT,
	OUT result INT,
	OUT message VARCHAR(255)
)
this_proc:
BEGIN 
	DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);
    
    -- Declare the handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET _rollback = 1;
        SET result = 0;
        SET message = sql_error_message;
        ROLLBACK;
    END;

    START TRANSACTION;
   
	INSERT INTO treatment_record(
		treatment_name, treatment_date, appointment_id, status
	)
	VALUES (
		t_treatment_name, t_treatment_date, t_appointment_id, 'U'
	);
	IF _rollback THEN
		SET result = 0;
		ROLLBACK;
	ELSE 
		SET result = 1;
		SET message = 'Add treatment successful';
		COMMIT;
	END IF;

	SELECT result, message;
END;

