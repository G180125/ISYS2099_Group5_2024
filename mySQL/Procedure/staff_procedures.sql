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
    IN s_manager_id INT
)
BEGIN
    START TRANSACTION;

    -- Insert the new staff record into the staff table
    INSERT INTO staff (first_name, last_name, email, password, gender, job_type, department_id, salary, manager_id)
    VALUES (s_first_name, s_last_name, s_email, s_password, s_gender, s_job_type, s_department_id, s_salary, s_manager_id);
    
    COMMIT;

    -- Retrieve and return the ID of the newly inserted staff member
    SELECT LAST_INSERT_ID() AS new_staff_id;
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
-- DELIMITER //
CREATE PROCEDURE list_staff_order_by_name(
    IN s_order VARCHAR(4),
    IN s_limit INT,
    IN s_offset INT 
)
this_proc:
BEGIN
    -- Check if the sort order is valid
    IF s_order NOT IN ('ASC', 'DESC') THEN
        LEAVE this_proc;
    ELSE
        -- Prepare and execute the dynamic query
        SET @query = CONCAT('SELECT * FROM staff ORDER BY first_name ', s_order, ', last_name ', s_order, 'LIMIT s_limit OFFSET s_offset;');
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END;

DROP PROCEDURE IF EXISTS update_staff;
-- DELIMITER //
CREATE PROCEDURE update_staff(
    IN s_staff_id INT,
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_department_id INT,
    IN s_salary DECIMAL(10, 2)
)
BEGIN
    START TRANSACTION;
    
    -- Update the staff record
    UPDATE staff
    SET first_name = s_first_name,
        last_name = s_last_name,
        job_type = s_job_type,      
        department_id = s_department_id,
        salary = s_salary
    WHERE staff_id = s_staff_id;

    COMMIT;
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