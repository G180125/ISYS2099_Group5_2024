DROP PROCEDURE IF EXISTS create_ticket_for_update_salary;

CREATE PROCEDURE create_ticket_for_update_salary(
    IN staff_id INT,
    IN new_salary INT,
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
    DECLARE current_salary INT;

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
    
    -- Select data from staff table based on staff_id
    SELECT S.first_name, S.last_name, S.gender, S.salary, S.manager_id
    INTO first_name, last_name, gender, current_salary, manager_id
    FROM staff S
    WHERE S.staff_id = staff_id;
    
    -- Insert the new ticket with concatenated note message
    INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, manager_id, creator, created_date, handled_by, status, note)
    VALUES (first_name, last_name, gender, NULL, NULL, new_salary, manager_id, staff_id, DATE(NOW()), NULL, 1, 
            CONCAT('Salary update request from ', current_salary, ' to ', new_salary));

    -- Final check before committing the transaction
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET message = 'Ticket creation successful for salary update successfully';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;


DROP PROCEDURE IF EXISTS create_ticket_for_update_job_type;

CREATE PROCEDURE create_ticket_for_update_job_type(
    IN staff_id INT,
    IN new_job_type ENUM('D', 'N', 'A'),
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);
    
    -- Declare variables to hold staff data
    DECLARE first_name VARCHAR(50);
    DECLARE last_name VARCHAR(50);
    DECLARE gender CHAR(1);
    DECLARE current_job_type ENUM('D', 'N', 'A');
    DECLARE department_id INT;
    DECLARE salary INT;
    DECLARE manager_id INT;

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
    
    -- Check if the new job type is a valid ENUM value
    IF new_job_type NOT IN ('D', 'N', 'A') THEN
        SET result = 0;
        SET message = 'Invalid job type. Must be D, N, or A.';
        ROLLBACK;
    ELSE
        -- Select data from staff table based on staff_id
        SELECT S.first_name, S.last_name, S.gender, S.job_type, S.department_id, S.salary, S.manager_id
        INTO first_name, last_name, gender, current_job_type, department_id, salary, manager_id
        FROM staff S
        WHERE S.staff_id = staff_id;

        -- Check if the new job type is different from the current one
        IF current_job_type = new_job_type THEN
            SET result = 0;
            SET message = 'New job type is the same as the current job type. No update needed.';
            ROLLBACK;
        ELSE
            -- Insert the new ticket for updating job type with a detailed note
            INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, manager_id, creator, created_date, handled_by, status, note)
            VALUES (first_name, last_name, gender, new_job_type, NULL, NULL, manager_id, staff_id, NOW(), NULL, 1, 
                    CONCAT('Job type update request from ', current_job_type, ' to ', new_job_type));

            -- Final check before committing the transaction
            IF _rollback THEN
                SET result = 0;
                ROLLBACK;
            ELSE
                SET result = 1;
                SET message = 'Ticket creation for job type update successful';
                COMMIT;
            END IF;
        END IF;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;

DROP PROCEDURE IF EXISTS create_ticket_for_update_department_id;

CREATE PROCEDURE create_ticket_for_update_department_id(
    IN staff_id INT,
    IN new_department_id INT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);
    
    -- Declare variables to hold staff data
    DECLARE first_name VARCHAR(50);
    DECLARE last_name VARCHAR(50);
    DECLARE gender CHAR(1);
    DECLARE current_department_id INT;
    DECLARE job_type ENUM('D', 'N', 'A');
    DECLARE manager_id INT;

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
    
    -- Validate the new department ID (Assume departments are numbered 1 through 100 for this example)
    IF new_department_id < 1 OR new_department_id > 100 THEN
        SET result = 0;
        SET message = 'Invalid department ID. Must be between 1 and 100.';
        ROLLBACK;
    ELSE
        -- Select data from staff table based on staff_id
        SELECT S.first_name, S.last_name, S.gender, S.job_type, S.department_id, S.manager_id
        INTO first_name, last_name, gender, job_type, current_department_id, manager_id
        FROM staff S
        WHERE S.staff_id = staff_id;
        
        IF current_department_id is NULL and job_type = 'A' THEN
			SET result = 0;
            SET message = 'Cannot update department Id for Admin';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
		END IF;

        -- Check if the new department ID is different from the current one
        IF current_department_id = new_department_id THEN
            SET result = 0;
            SET message = 'New department ID is the same as the current department ID. No update needed.';
            ROLLBACK;
        ELSE
            -- Insert the new ticket for updating department ID with a detailed note
            INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, manager_id, creator, created_date, handled_by, status, note)
            VALUES (first_name, last_name, gender, NULL, new_department_id, NULL, manager_id, staff_id, DATE(NOW()), NULL, 1, 
                    CONCAT('Department ID update request from ', current_department_id, ' to ', new_department_id));

            -- Final check before committing the transaction
            IF _rollback THEN
                SET result = 0;
                ROLLBACK;
            ELSE
                SET result = 1;
                SET message = 'Ticket creation for department ID update successful';
                COMMIT;
            END IF;
        END IF;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;