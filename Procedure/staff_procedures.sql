----------------------- Procedure to add a new staff -----------------------
/*
OUT result:

Description:
This stored procedure adds a new staff member to the system then return the id of the new staff.
*/
DROP PROCEDURE IF EXISTS add_new_staff;
DELIMITER //
CREATE PROCEDURE add_new_staff (
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_department_id INT,
    IN s_salary DECIMAL(10, 2),
    IN s_manager_id INT
)
this_proc:
BEGIN
    START TRANSACTION;

    -- validate the salary
    IF s_salary <= 0 THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Insert the new staff record into the staff table
    INSERT INTO staff (first_name, last_name, job_type, department_id, salary, manager_id)
    VALUES (s_first_name, s_last_name, s_job_type, s_department_id, s_salary, s_manager_id);
    
    COMMIT;

    -- Retrieve and return the ID of the newly inserted staff member
    SELECT LAST_INSERT_ID() AS new_staff_id;
END //
DELIMITER ;

----------------------- Procedure to list staff by department -----------------------
/*
Description:
This stored procedure retrieves a list of all staff members belonging to a specified department. 
*/
DROP PROCEDURE IF EXISTS list_staff_by_department;
DELIMITER //
CREATE PROCEDURE list_staff_by_department(
    IN s_department_id INT,
)
BEGIN
    --  return the staff list by department
    SELECT * FROM staff 
    WHERE department_id = s_department_id;
    ORDER BY department_id, last_name, first_name;
END //
DELIMITER ;

----------------------- Procedure to list staff by name -----------------------
/*
Description:
This stored procedure lists all staff members sorted by their first and last names in the specified order.
*/
DROP PROCEDURE IF EXISTS list_staff_by_name;
DELIMITER //
CREATE PROCEDURE list_staff_by_name(
    IN s_order VARCHAR(4)
)
this_proc:
BEGIN
    -- Check if the sort order is valid
    IF s_order NOT IN ('ASC', 'DESC') THEN
        LEAVE this_proc;
    ELSE
        -- Prepare and execute the dynamic query
        SET @query = CONCAT('SELECT * FROM staff ORDER BY first_name ', s_order, ', last_name ', s_order);
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //
DELIMITER ;


----------------------- Procedure to update staff by manager -----------------------
/*
Description:
This stored process enables a management to modify the information of a staff person under their control. 
The method validates if the given manager ID matches the manager ID of the staff member in the database. 
If the validation is successful, the procedure updates the staff member's details, including first name, last name, job type, department ID, work schedule, and salary.
*/
DROP PROCEDURE IF EXISTS update_staff_by_manager;
DELIMITER //
CREATE PROCEDURE update_staff_by_manager(
    IN s_staff_id INT,
    IN s_manager_id INT,  -- The ID of the manager attempting to update the staff member.
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_department_id INT,
    IN s_salary DECIMAL(10, 2),
)
this_proc:
BEGIN
    DECLARE authorized_manager_id INT;

    START TRANSACTION;

    -- Check if the provided manager_id matches the staff member's manager_id
    SELECT manager_id INTO authorized_manager_id
    FROM staff
    WHERE staff_id = s_staff_id;

    IF authorized_manager_id != s_manager_id THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Check if the salary is valid (positive value)
    IF s_salary <= 0 THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Lock the row to ensure it is not modified by other transactions
    SELECT * FROM staff
    WHERE staff_id = s_staff_id FOR SHARE;

    -- Proceed with the update if authorized
    UPDATE staff
    SET first_name = s_first_name,
        last_name = s_last_name,
        job_type = s_job_type,
        department_id = s_department_id,
        salary = s_salary
    WHERE staff_id = s_staff_id;

    COMMIT;
END //
DELIMITER ;

----------------------- Procedure to update own staff information -----------------------
/*
Description:
This stored procedure allows a staff member to update their own first name and last name. It verifies that the staff ID exists in 
the system and, if valid, updates the first name and last name fields for that staff member. The procedure returns a result code 
indicating success or failure.
*/
DROP PROCEDURE IF EXISTS update_my_info;
DELIMITER //
CREATE PROCEDURE update_my_info(
    IN s_staff_id INT,
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100)
)
this_proc:
BEGIN
    START TRANSACTION;
    
    -- Check if the staff ID exists
    IF (SELECT COUNT(*) FROM staff WHERE staff_id = s_staff_id) = 0 THEN
        ROLLBACK;
        LEAVE this_proc;
    ELSE
        -- Lock the row to ensure it is not modified by other transactions
        SELECT * FROM staff
        WHERE staff_id = s_staff_id FOR SHARE;

        -- Update the staff member's first name and last name
        UPDATE staff
        SET first_name = s_first_name,
            last_name = s_last_name
        WHERE staff_id = s_staff_id;

        COMMIT;
    END IF;
    
END //
DELIMITER ;


----------------------- Procedure to view staff schedule -----------------------
/*
Description:
This stored procedure retrieves the schedule for a specified staff member based on their staff ID. 
It first checks if the staff ID exists in the staff table. If the staff ID is valid, it returns all 
entries in the schedule table associated with the given staff ID, sorted by date and time.
*/
DROP PROCEDURE IF EXISTS view_staff_schedule;
DELIMITER //
CREATE PROCEDURE view_staff_schedule(
    IN p_staff_id INT,       -- The ID of the staff member whose schedule you want to view.       
)
BEGIN
    -- If staff ID exists, retrieve the schedule
    SELECT *
    FROM schedule
    WHERE staff_id = p_staff_id
    ORDER BY schedule_date, schedule_time;
END //
DELIMITER ;

----------------------- Procedure to update staff schedule -----------------------


------------------------ Procedure to add a custom object ------------------------