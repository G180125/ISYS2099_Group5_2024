DROP PROCEDURE IF EXISTS create_ticket_for_update;
CREATE PROCEDURE create_ticket_for_update(
    IN staff_id INT,
    IN new_first_name VARCHAR(100),
    IN new_last_name VARCHAR(100),
    IN new_gender ENUM('M', 'F', 'O'), 
    IN new_salary DECIMAL(10, 2),    -- Nullable: new salary, or NULL if not updating
    IN new_job_type ENUM('D', 'N', 'A'), -- Nullable: new job type, or NULL if not updating
    IN new_department_id INT,        -- Nullable: new department ID, or NULL if not updating
    IN notes TEXT,
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
    
    -- Check if all update inputs are NULL
    IF new_first_name IS NULL AND new_last_name IS NULL AND new_gender IS NULL AND 
       new_salary IS NULL AND new_job_type IS NULL AND new_department_id IS NULL THEN
        SET result = 0;
        SET message = 'No values provided for update.';
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Update Salary if new_salary is not NULL
    IF new_salary IS NOT NULL THEN
        IF new_salary < 0 THEN
            SET result = 0;
            SET message = 'Invalid salary format. Must be a non-negative decimal number. ';
            SELECT result, message;
            ROLLBACK;
			leave this_proc;
        END IF;
    END IF;

    -- Update Job Type if new_job_type is not NULL
    IF new_job_type IS NOT NULL THEN
        IF new_job_type NOT IN ('D', 'N', 'A') THEN
            SET result = 0;
            SET message = 'Invalid job type. Must be D, N, or A. ';
            ROLLBACK;
            SELECT result, message;
            leave this_proc;
        END IF;
    END IF;

    -- Update Department ID if new_department_id is not NULL
    IF new_department_id IS NOT NULL THEN
        IF new_department_id < 1 OR new_department_id > 100 THEN
            SET result = 0;
            SET message = 'Invalid department ID.';
            ROLLBACK;
            SELECT result, message;
            leave this_proc;
        END IF;
    END IF;

    -- Final check before committing the transaction
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
		INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, creator, created_date, handled_by, status, note)
        VALUES (new_first_name, new_last_name, new_gender, new_job_type, new_department_id, new_salary, staff_id, DATE(NOW()), NULL, 1, notes);
        SET result = 1;
        SET message = 'Ticket creation successful for updates';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;

DROP PROCEDURE IF EXISTS update_ticket_for_update;
CREATE PROCEDURE update_ticket_for_update(
    IN t_id INT,
    IN staff_id INT,
    IN new_first_name VARCHAR(100),
    IN new_last_name VARCHAR(100),
    IN new_gender ENUM('M', 'F', 'O'), 
    IN new_salary DECIMAL(10, 2),    -- Nullable: new salary, or NULL if not updating
    IN new_job_type ENUM('D', 'N', 'A'), -- Nullable: new job type, or NULL if not updating
    IN new_department_id INT,        -- Nullable: new department ID, or NULL if not updating
    IN notes TEXT,
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
    -- Update Salary if new_salary is not NULL
    IF new_salary IS NOT NULL THEN
        IF new_salary < 0 THEN
            SET result = 0;
            SET message = 'Invalid salary format. Must be a non-negative decimal number. ';
            SELECT result, message;
            ROLLBACK;
			leave this_proc;
        END IF;
    END IF;

    -- Update Job Type if new_job_type is not NULL
    IF new_job_type IS NOT NULL THEN
        IF new_job_type NOT IN ('D', 'N', 'A') THEN
            SET result = 0;
            SET message = 'Invalid job type. Must be D, N, or A. ';
            ROLLBACK;
            SELECT result, message;
            leave this_proc;
        ELSE
			SET notes = CONCAT(notes, 'Job type update request from ', current_job_type, ' to ', new_job_type, '. ');
        END IF;
    END IF;

    -- Update Department ID if new_department_id is not NULL
    IF new_department_id IS NOT NULL THEN
        IF new_department_id < 1 OR new_department_id > 100 THEN
            SET result = 0;
            SET message = 'Invalid department ID.';
            ROLLBACK;
            SELECT result, message;
            leave this_proc;
        END IF;
    END IF;

    SELECT * FROM ticket WHERE ticket_id = t_id FOR UPDATE;

    -- Final check before committing the transaction
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
		UPDATE ticket
        SET
            first_name = COALESCE(new_first_name, first_name),
            last_name = COALESCE(new_last_name, last_name),
            gender = COALESCE(new_gender, gender),
            salary = COALESCE(new_salary, salary),
            job_type = COALESCE(new_job_type, job_type),
            department_id = COALESCE(new_department_id, department_id),
            note = CONCAT(note, IFNULL(notes, ''))
        WHERE ticket_id = t_id;

        SET result = 1;
        SET message = 'Ticket creation successful for updates: ';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;

DROP PROCEDURE IF EXISTS approve_ticket_for_update;
CREATE PROCEDURE approve_ticket_for_update(
    IN t_id INT,
    IN admin_id INT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE sql_error_message VARCHAR(255);
    DECLARE _creator INT;
    DECLARE _first_name VARCHAR(255);
    DECLARE _last_name VARCHAR(255);
    DECLARE _gender CHAR(1);
    DECLARE _job_type VARCHAR(255);
    DECLARE _department_id INT;
    DECLARE _salary DECIMAL(10,2);
    DECLARE _ticket_status CHAR(1);

    -- Handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET result = 0;
        SET message = sql_error_message;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Fetch all necessary details from the ticket
    SELECT creator, first_name, last_name, gender, job_type, department_id, salary, status
    INTO _creator, _first_name, _last_name, _gender, _job_type, _department_id, _salary, _ticket_status
    FROM ticket 
    WHERE ticket_id = t_id 
    FOR UPDATE;
    
    -- cook section
    -- check if ticket exists
    IF NOT EXISTS (SELECT status FROM ticket WHERE ticket_id = t_id) THEN
        ROLLBACK;
        SET result = 0;
        SET message = 'Ticket not found';
        
    -- check if ticket is non-pending
    ELSEIF EXISTS (SELECT status FROM ticket WHERE ticket_id = t_id AND status <> 'P') THEN
        ROLLBACK;
        SET result = 0;
        SET message = 'Cannot approve a non-pending ticket.';
        
    -- if fine, udpate_staff + return result
    ELSE
        CALL update_staff( _creator, _first_name, _last_name, 
                            _gender, _job_type, _department_id, 
                            _salary, result, message);
        UPDATE ticket
            SET status = 'A', handled_by = admin_id
            WHERE ticket_id = t_id;
        COMMIT;
        
        SET result = 1;
        SET message = 'Ticket approval successful';
    END IF;
    
    SELECT result, message;
END;


DROP PROCEDURE IF EXISTS reject_ticket_for_update;
CREATE PROCEDURE reject_ticket_for_update(
    IN t_id INT,
    IN admin_id INT,
    IN note TEXT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE _ticket_status CHAR(1);
    DECLARE sql_error_message VARCHAR(255);

    -- Handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET _rollback = 1;
        SET result = 0;
        SET message = sql_error_message;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- check if ticket exists
    IF NOT EXISTS (SELECT status FROM ticket WHERE ticket_id = t_id) THEN
        ROLLBACK;
        SET result = 0;
        SET message = 'Ticket not found';
        SELECT result, message;
        LEAVE this_proc;
    END IF;

    -- Check if any rollback was set
    -- check if pending
    IF EXISTS (SELECT status FROM ticket WHERE ticket_id = t_id AND status <> 'P') THEN
        ROLLBACK;
        
        SET result = 0;
        SET message = 'Cannot reject a non-pending ticket.';
    ELSE
        UPDATE ticket
        SET 
            status = 'R',
            handled_by = admin_id,
            note = note
        WHERE ticket_id = t_id;
        COMMIT;
        
        SET result = 1;
        SET message = CONCAT('Ticket rejected ', message);
    END IF;

    -- Return the result and message
    SELECT result, message;
END;

DROP PROCEDURE IF EXISTS delete_ticket_for_update;
CREATE PROCEDURE delete_ticket_for_update(
    IN t_id INT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);

    -- Handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET _rollback = 1;
        SET result = 0;
        SET message = sql_error_message;
        ROLLBACK;
    END;

    START TRANSACTION;

    IF EXISTS (SELECT * FROM ticket WHERE ticket_id = t_id FOR UPDATE) THEN
        DELETE FROM ticket
        WHERE ticket_id = t_id;
        SET result = 1;
        SET message = 'Ticket deleted ';
        COMMIT;
        SELECT result, message;
        LEAVE this_proc;
    ELSE 
        SET _rollback = 1;
    END IF; 

    -- Check if any rollback was set
    IF _rollback THEN
        SET result = 0;
        SET message = 'No Ticket Found';
        ROLLBACK;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;