/*
    OUT result:
        0: Fail
        1: Success
*/
DROP PROCEDURE IF EXISTS add_new_staff;
-- DELIMITER //
CREATE PROCEDURE add_new_staff (
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    IN s_email VARCHAR(100),
    IN s_password VARCHAR(100),
    IN s_gender ENUM('M', 'F', 'O'),
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_department_id INT,
    IN s_salary DECIMAL(10, 2),
    IN s_manager_id INT,
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

    -- Check if salary is valid
    IF s_salary < 0 THEN
        SET result = 0;
        SET message = 'Salary must be a positive number';
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Insert the new staff record into the staff table
    INSERT INTO staff (first_name, last_name, email, password, gender, job_type, department_id, salary, manager_id)
    VALUES (s_first_name, s_last_name, s_email, s_password, s_gender, s_job_type, s_department_id, s_salary, s_manager_id);
    
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


DROP PROCEDURE IF EXISTS list_staff_by_department;
-- DELIMITER //
CREATE PROCEDURE list_staff_by_department(
    IN s_department_id INT,
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_limit INT,
    IN s_offset INT  
)
BEGIN
    --  return the staff list by department
    SELECT * FROM staff 
    WHERE department_id = s_department_id 
    AND (s_job_type IS NULL OR job_type = s_job_type)
    ORDER BY department_id, last_name, first_name
    LIMIT s_limit OFFSET s_offset;
END;

DROP PROCEDURE IF EXISTS list_staff_order_by_name;
CREATE PROCEDURE list_staff_order_by_name(
    IN p_order VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    IF p_order = 'ASC' THEN
        SELECT * FROM staff
        ORDER BY first_name, last_name ASC
        LIMIT p_limit OFFSET p_offset;
    ELSE
        SELECT * FROM staff
        ORDER BY first_name, last_name DESC
        LIMIT p_limit OFFSET p_offset;
    END IF;
END $$

/*
    OUT result:
        0: Fail
        1: Success
*/
DROP PROCEDURE IF EXISTS update_staff;
-- DELIMITER //
CREATE PROCEDURE update_staff(
    IN s_email VARCHAR(255),
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    IN s_gender ENUM ('M', 'F', 'O'),
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_department_id INT,
    IN s_salary DECIMAL(10, 2),
    IN s_manager_id INT,
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

    -- Check if the staff exists
    IF (SELECT COUNT(*) FROM staff WHERE email = s_email) = 0 THEN
        SET result = 0;
        SET message = 'Staff member not found';
        ROLLBACK;
        LEAVE this_proc;
    END IF;

     -- Check if salary is valid
    IF s_salary < 0 THEN
        SET result = 0;
        SET message = 'Salary must be a positive number';
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Lock the staff for update
    SELECT *
    FROM staff 
    WHERE email = s_email FOR UPDATE;

    -- Update the staff record
    UPDATE staff
    SET first_name = s_first_name,
        last_name = s_last_name,
        gender = s_gender,
        job_type = s_job_type,      
        department_id = s_department_id,
        salary = s_salary,
        manager_id = s_manager_id
    WHERE email = s_email;

   IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET message = 'Update successfully';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END; -- //
-- DELIMITER ;

DROP PROCEDURE IF EXISTS view_staff_schedule;
-- DELIMITER //
CREATE PROCEDURE view_staff_schedule(
    IN p_staff_id INT,
    IN s_limit INT,
    IN s_offset INT        
)
BEGIN
    SELECT *
    FROM schedule
    WHERE staff_id = p_staff_id
    ORDER BY schedule_date
    LIMIT s_limit OFFSET s_offset;
END;