DROP VIEW IF EXISTS all_patient_treatment_history;
CREATE VIEW all_patient_treatment_history AS
SELECT 
    treatment_id,
    treatment_name,
    treatment_date,
    appointment_id,
    status
FROM 
    treatment_record;


DROP PROCEDURE IF EXISTS view_patient_treatment_for_given_duration_by_email;
CREATE PROCEDURE view_patient_treatment_for_given_duration_by_email(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_email VARCHAR(100),
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
	IF NOT EXISTS
		(SELECT P.first_name, P.last_name, P.email, T.treatment_name, T.treatment_date
		FROM treatment_record t
		JOIN appointment A
		ON t.appointment_id = A.appointment_id
		JOIN patient P
		ON P.patient_id = A.patient_id
		WHERE T.treatment_date BETWEEN p_start_date AND p_end_date
		AND p_email = P.email)
    THEN 
		SET result = 0;
        SET message = 'No data found';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
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
END;

DROP PROCEDURE IF EXISTS view_patient_treatment_in_given_duration;
CREATE PROCEDURE view_patient_treatment_in_given_duration(
    IN p_start_date DATE,
    IN p_end_date DATE,
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
	IF NOT EXISTS
		(SELECT * 
			FROM treatment_record
			WHERE treatment_date BETWEEN p_start_date AND p_end_date)
    THEN 
		SET result = 0;
        SET message = 'No data found';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
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
END;

-- View the work of a doctor in a given duration
DROP PROCEDURE IF EXISTS view_doctor_work_for_given_duration_by_email;
CREATE PROCEDURE view_doctor_work_for_given_duration_by_email(
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
	IF NOT EXISTS
		(SELECT S.first_name, S.last_name, S.email, SC.schedule_date, A.slot_number
		FROM staff S
		JOIN schedule SC
		ON S.staff_id = SC.staff_id
		JOIN appointment A
		ON SC.schedule_id = A.schedule_id
		WHERE SC.schedule_date BETWEEN start_date AND end_date
		AND email = S.email)
    THEN 
		SET result = 0;
        SET message = 'No data found';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
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
END;


-- View the work of all doctors in a given duration
DROP PROCEDURE IF EXISTS view_doctor_work_in_given_duration;
CREATE PROCEDURE view_doctor_work_in_given_duration(
    IN start_date DATE,
    IN end_date DATE,
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
	IF NOT EXISTS
		(SELECT S.first_name, S.last_name, S.email, SC.schedule_date, A.slot_number
		FROM staff S
		JOIN schedule SC
		ON S.staff_id = SC.staff_id
		JOIN appointment A
		ON SC.schedule_id = A.schedule_id
		WHERE SC.schedule_date BETWEEN start_date AND end_date)
    THEN 
		SET result = 0;
        SET message = 'No data found';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
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
END;


-- View job change history of a staff (need relation)