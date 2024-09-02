DROP PROCEDURE IF EXISTS create_ticket_for_update;
CREATE PROCEDURE create_ticket_for_update(
    IN staff_id INT,
    IN new_salary DECIMAL(10, 2),    -- Nullable: new salary, or NULL if not updating
    IN new_job_type ENUM('D', 'N', 'A'), -- Nullable: new job type, or NULL if not updating
    IN new_department_id INT,        -- Nullable: new department ID, or NULL if not updating
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);

    -- Declare variables to hold staff data
    DECLARE first_name VARCHAR(100);
    DECLARE last_name VARCHAR(100);
    DECLARE gender CHAR(1);
    DECLARE manager_id INT;
    DECLARE current_salary DECIMAL(10, 2);
    DECLARE current_job_type ENUM('D', 'N', 'A');
    DECLARE current_department_id INT;
    DECLARE notes TEXT;

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

    -- Fetch common staff details
    SELECT S.staff_first_name, S.staff_last_name, S.staff_gender, S.staff_salary, S.staff_job_type, S.department_id, S.manager_id
    INTO first_name, last_name, gender, current_salary, current_job_type, current_department_id, manager_id
    FROM staff_secure_view S
    WHERE S.staff_id = staff_id;

    -- Initialize notes for changes
    SET notes = '';
    
    IF new_salary IS NULL AND new_job_type is NULL AND new_department_id IS NULL THEN
		SET result = 0;
		SET message = 'No value to update. ';
		SELECT result, message;
        ROLLBACK;
		leave this_proc;
	END IF;

    -- Update Salary if new_salary is not NULL
    IF new_salary IS NOT NULL THEN
        IF new_salary < 0 THEN
            SET result = 0;
            SET message = 'Invalid salary format. Must be a non-negative decimal number. ';
            SELECT result, message;
            ROLLBACK;
			leave this_proc;
        ELSE 
			SET notes = CONCAT(notes, 'Salary update request from ', current_salary, ' to ', new_salary, '. ');
        END IF;
    END IF;

    -- Update Job Type if new_job_type is not NULL
    IF new_job_type IS NOT NULL THEN
        IF new_job_type NOT IN ('D', 'N', 'A') THEN
            SET result = 0;
            SET message = 'Invalid job type. Must be D, N, or A. ';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSE
			SET notes = CONCAT(notes, 'Job type update request from ', current_job_type, ' to ', new_job_type, '. ');
        END IF;
    END IF;

    -- Update Department ID if new_department_id is not NULL
    IF new_department_id IS NOT NULL THEN
        IF new_department_id < 1 OR new_department_id > 100 THEN
            SET result = 0;
            SET message = 'Invalid department ID. Must be between 1 and 100. ';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSEIF current_department_id IS NULL AND current_job_type = 'A' THEN
			SET _rollback = 1;
            SET result = 0;
            SET message = 'Cannot update department ID for Admin. ';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSE
			SET notes = CONCAT(notes, 'Department ID update request from ', current_department_id, ' to ', new_department_id, '. ');
        END IF;
    END IF;

    -- Final check before committing the transaction
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
		INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, manager_id, creator, created_date, handled_by, status, note)
        VALUES (first_name, last_name, gender, new_job_type, new_department_id, new_salary, manager_id, staff_id, DATE(NOW()), NULL, 1, notes);
        SET result = 1;
        SET message = 'Ticket creation successful for updates: ';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;