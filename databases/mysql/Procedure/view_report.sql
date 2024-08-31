-- View a patient treatment history for a given duration 
DROP PROCEDURE IF EXISTS view_patient_treatment_for_given_duration;
CREATE PROCEDURE view_patient_treatment_for_given_duration(
    IN start_date DATE,
    IN end_date DATE,
    IN email VARCHAR(100),
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
		SELECT result, message;
	END;

	START TRANSACTION;
    
	IF email is NULL THEN
		SELECT *
			FROM treatment_report TR
			WHERE TR.treatment_date BETWEEN start_date AND end_date;
	ELSE
		SELECT *
		FROM treatment_report TR
		WHERE TR.treatment_date BETWEEN start_date AND end_date
		AND email = TR.patient_email;
	END IF;
			
    -- Commit or rollback based on the transaction status
    IF _rollback THEN
		SET result = 0;
        ROLLBACK;
    ELSE 
        COMMIT;
        SET result = 1;
        SET message = 'View sucessfully';
    END IF;

    -- Return the result and message
	SELECT result, message;
END ;

-- View the work of a doctor in a given duration 
DROP PROCEDURE IF EXISTS view_doctor_work_for_given_duration;
CREATE PROCEDURE view_doctor_work_for_given_duration(
    IN start_date DATE,
    IN end_date DATE,
    IN email VARCHAR(100),
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
		SELECT result, message;
	END;

	START TRANSACTION;
    
	IF email is NULL THEN
		SELECT *
			FROM doctor_work_report DR
			WHERE DR.schedule_date BETWEEN start_date AND end_date;
	ELSE
		SELECT *
		FROM doctor_work_report DR
		WHERE DR.schedule_date BETWEEN start_date AND end_date
		AND email = DR.staff_email;			
	END IF;
			
    -- Commit or rollback based on the transaction status
    IF _rollback THEN
		SET result = 0;
        ROLLBACK;
    ELSE 
        COMMIT;
        SET result = 1;
        SET message = 'View sucessfully';
    END IF;

    -- Return the result and message
	SELECT result, message;
END ;

-- View job change history of a staff (need relation)