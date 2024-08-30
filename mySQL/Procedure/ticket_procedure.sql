DROP PROCEDURE IF EXISTS create_ticket_for_update;

CREATE PROCEDURE create_ticket_for_update(
    IN staff_id INT,
    IN update_type ENUM('salary', 'job_type', 'department_id'), -- ENUM for update types
    IN new_value VARCHAR(50),   -- Can represent new_salary, new_job_type, or new_department_id
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
    DECLARE new_salary DECIMAL(10, 2);
    DECLARE current_job_type ENUM('D', 'N', 'A');
    DECLARE new_job_type ENUM('D', 'N', 'A');
    DECLARE current_department_id INT;
    DECLARE new_department_id INT;

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
    SELECT S.first_name, S.last_name, S.gender, S.salary, S.job_type, S.department_id, S.manager_id
    INTO first_name, last_name, gender, current_salary, current_job_type, current_department_id, manager_id
    FROM staff S
    WHERE S.staff_id = staff_id;

    -- Determine the type of update
    IF update_type = 'salary' THEN
        -- Convert new_value to DECIMAL for salary
        SET @is_numeric := new_value REGEXP '^-?[0-9]+(\.[0-9]{1,2})?$';
        SET new_salary = CAST(new_value AS DECIMAL(10, 2));

        -- Validate salary
        IF @is_numeric = 0 OR new_salary < 0 THEN
            SET result = 0;
            SET message = 'Invalid salary format. Must be a non-negative decimal number.';
			SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSEIF current_salary = new_salary THEN
            SET result = 0;
            SET message = 'New salary is the same as the current salary. No update needed.';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSE
            -- Insert the new ticket for salary update
            INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, manager_id, creator, created_date, handled_by, status, note)
            VALUES (first_name, last_name, gender, NULL, NULL, new_salary, manager_id, staff_id, DATE(NOW()), NULL, 1, 
                    CONCAT('Salary update request from ', current_salary, ' to ', new_salary));
        END IF;

    ELSEIF update_type = 'job_type' THEN
        SET new_job_type = new_value;

        -- Validate new job type
        IF new_job_type NOT IN ('D', 'N', 'A') THEN
            SET result = 0;
            SET message = 'Invalid job type. Must be D, N, or A.';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSEIF current_job_type = new_job_type THEN
            SET result = 0;
            SET message = 'New job type is the same as the current job type. No update needed.';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSE
            -- Insert the new ticket for job type update
            INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, manager_id, creator, created_date, handled_by, status, note)
            VALUES (first_name, last_name, gender, new_job_type, NULL, NULL, manager_id, staff_id, NOW(), NULL, 1, 
                    CONCAT('Job type update request from ', current_job_type, ' to ', new_job_type));
        END IF;

    ELSEIF update_type = 'department_id' THEN
        SET new_department_id = CAST(new_value AS UNSIGNED);

        -- Validate new department ID
        IF new_department_id < 1 OR new_department_id > 100 THEN
            SET result = 0;
            SET message = 'Invalid department ID. Must be between 1 and 100.';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSEIF current_department_id = new_department_id THEN
            SET result = 0;
            SET message = 'New department ID is the same as the current department ID. No update needed.';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSEIF current_department_id IS NULL AND current_job_type = 'A' THEN
            SET result = 0;
            SET message = 'Cannot update department ID for Admin';
            SELECT result, message;
            ROLLBACK;
            leave this_proc;
        ELSE
			-- Insert the new ticket for job type update
            INSERT INTO ticket (first_name, last_name, gender, job_type, department_id, salary, manager_id, creator, created_date, handled_by, status, note)
            VALUE (first_name, last_name, gender, NULL, new_department_id, NULL, manager_id, staff_id, DATE(NOW()), NULL, 1, 
                    CONCAT('Department ID update request from ', current_department_id, ' to ', new_department_id));
        END IF;

    ELSE
        SET result = 0;
        SET message = 'Invalid update type specified. Must be salary, job_type, or department_id.';
        SELECT result, message;
        ROLLBACK;
        leave this_proc;
    END IF;

    -- Final check before committing the transaction
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET message = CONCAT('Ticket creation for ', update_type, ' update successful');
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;