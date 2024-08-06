----------------------- Procedure to add a new staff -----------------------
/*
OUT result:
    -2: Manager does not exist
    -1: Invalid salary value
    0: Department does not exist
    1: Success

Description:
This stored procedure adds a new staff member to the system. It first validates that the department ID and manager ID exist in the database 
and that the salary is a positive value. If all validations pass, it inserts the new staff record. The procedure returns various result codes 
to indicate the success or failure of the operation.
*/
DELIMITER //
CREATE PROCEDURE add_staff(
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_department_id INT,
    IN s_salary DECIMAL(10, 2),
    IN s_manager_id INT,
    OUT result INT
)
BEGIN
    DECLARE department_exists INT;
    DECLARE manager_exists INT;

    -- Check if the department exists
    SELECT COUNT(*) INTO department_exists
    FROM department
    WHERE department_id = s_department_id;

    IF department_exists = 0 THEN
        SET result = 0;
        RETURN;
    END IF;

    -- Check if the salary is valid (positive value)
    IF s_salary <= 0 THEN
        SET result = -1; 
        RETURN;
    END IF;

    -- Check if the manager exists
    SELECT COUNT(*) INTO manager_exists
    FROM staff
    WHERE staff_id = s_manager_id;

    IF manager_exists = 0 THEN
        SET result = -2;
        RETURN;
    END IF;

    -- If all validations pass, insert the staff record
    INSERT INTO staff (first_name, last_name, job_type, department_id, salary, manager_id)
    VALUES (s_first_name, s_last_name, s_job_type, s_department_id, s_salary, s_manager_id);

    SET result = 1;
END //
DELIMITER ;

----------------------- Procedure to list staff by department -----------------------
/*
OUT result:
    0: Department does not exist
    1: Success

Description:
This stored procedure retrieves a list of all staff members belonging to a specified department. It first checks if the department exists; 
if it does, it returns the list of staff members. The result code indicates whether the operation was successful or if the department does not exist.
*/
DELIMITER //
CREATE PROCEDURE list_staff_by_department(
    IN s_department_id INT,
    OUT result INT
)
BEGIN
    DECLARE department_exists INT;

    -- Check if the department exists
    IF department_exists = 0 THEN
        SET result = 0; 
        RETURN;
    END IF;

    -- If department exists, return the staff list
    SELECT * FROM staff
    WHERE department_id = s_department_id;

    SET result = 1;
END //
DELIMITER ;

----------------------- Procedure to list staff by name -----------------------
/*
OUT result:
    0: Invalid order input
    1: Success

Description:
This stored procedure lists all staff members sorted by their first and last names in the specified order. The procedure checks if the input 
order is valid ('ASC' or 'DESC') and dynamically constructs the query accordingly. The result code indicates whether the operation was successful 
or if the input order was invalid.
*/
DELIMITER //
CREATE PROCEDURE list_staff_by_name(
    IN s_order VARCHAR(4),
    OUT result INT
)
BEGIN
    -- Check for valid order input ('ASC' or 'DESC')
    IF s_order NOT IN ('ASC', 'DESC') THEN
        SET result = 0;
        RETURN;
    END IF;

    -- Prepare and execute the dynamic query
    SET @query = CONCAT('SELECT * FROM staff ORDER BY first_name ', s_order, ', last_name ', s_order);
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SET result = 1;
END //
DELIMITER ;

----------------------- Procedure to update staff by manager -----------------------
/*
OUT result:
    -4: Invalid salary value
    -3: Department does not exist
    -2: Staff does not exist
    -1: Unauthorized attempt (provided manager_id does not match the staff member's manager_id).
    0: Staff member not found.
    1: Update successful.
    
Description:
This stored process enables a management to modify the information of a staff person under their control. 
The method validates if the given manager ID matches the manager ID of the staff member in the database. 
If the validation is successful, the procedure updates the staff member's details, including first name, last name, job type, department ID, work schedule, and salary.
*/
DELIMITER //
CREATE PROCEDURE update_staff_by_manager(
    IN s_staff_id INT,
    IN s_manager_id INT,  -- The ID of the manager attempting to update the staff member.
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    IN s_job_type ENUM('D', 'N', 'A'),
    IN s_department_id INT,
    IN s_salary DECIMAL(10, 2),
    OUT result INT
)
BEGIN
    DECLARE authorized_manager_id INT;
    DECLARE staff_exists INT;

    -- Check if the provided manager_id matches the staff member's manager_id
    SELECT manager_id INTO authorized_manager_id
    FROM staff
    WHERE staff_id = s_staff_id;

    IF authorized_manager_id IS NULL THEN
        SET result = 0;
        RETURN;
    ELSEIF authorized_manager_id != s_manager_id THEN
        SET result = -1;
        RETURN;
    END IF;

    -- Check if the staff exists
    SELECT COUNT(*) INTO staff_exists
    FROM staff
    WHERE staff_id = s_staff_id;

    IF patient_exists = 0 THEN
        SET result = -2;
        RETURN;
    END IF;

    -- Check if the department exists
    SELECT COUNT(*) INTO department_exists
    FROM department
    WHERE department_id = s_department_id;

    IF department_exists = 0 THEN
        SET result = -3;
        RETURN;
    END IF;

    -- Check if the salary is valid (positive value)
    IF s_salary <= 0 THEN
        SET result = -4; 
        RETURN;
    END IF;


    -- Proceed with the update if authorized
    UPDATE staff
    SET first_name = s_first_name,
        last_name = s_last_name,
        job_type = s_job_type,
        department_id = s_department_id,
        salary = s_salary
    WHERE staff_id = s_staff_id;

    SET result = 1;  -- Update successful
END //
DELIMITER ;

----------------------- Procedure to update own staff information -----------------------
/*
OUT result:
    -2: Staff does not exist
    1: Success

Description:
This stored procedure allows a staff member to update their own first name and last name. It verifies that the staff ID exists in 
the system and, if valid, updates the first name and last name fields for that staff member. The procedure returns a result code 
indicating success or failure.
*/
DELIMITER //
CREATE PROCEDURE update_my_info(
    IN s_staff_id INT,
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
    OUT result INT
)
BEGIN
    DECLARE staff_exists INT;

    -- Check if the staff exists
    SELECT COUNT(*) INTO staff_exists
    FROM staff
    WHERE staff_id = s_staff_id;

    IF staff_exists = 0 THEN
        SET result = -2; 
        RETURN;
    END IF;

    -- Update the staff member's first name and last name
    UPDATE staff
    SET first_name = s_first_name,
        last_name = s_last_name
    WHERE staff_id = s_staff_id;

    SET result = 1;  
END //
DELIMITER ;

----------------------- Procedure to view staff schedule -----------------------
/*
OUT result:
    0: Staff does not exist.
    1: Success.

Description:
This stored procedure retrieves the schedule for a specified staff member based on their staff ID. 
It first checks if the staff ID exists in the staff table. If the staff ID is valid, it returns all 
entries in the schedule table associated with the given staff ID, sorted by date and time.
*/
DELIMITER //
CREATE PROCEDURE view_staff_schedule(
    IN p_staff_id INT,       -- The ID of the staff member whose schedule you want to view.
    OUT result INT           
)
BEGIN
    DECLARE staff_exists INT;

    -- Check if the staff ID exists
    SELECT COUNT(*) INTO staff_exists
    FROM staff
    WHERE staff_id = p_staff_id;

    IF staff_exists = 0 THEN
        SET result = 0;    
        RETURN;
    END IF;

    -- If staff ID exists, retrieve the schedule
    SELECT *
    FROM schedule
    WHERE staff_id = p_staff_id
    ORDER BY schedule_date, schedule_time;

    SET result = 1;   
END //
DELIMITER ;

----------------------- Procedure to update staff schedule -----------------------


------------------------ Procedure to add a custom object ------------------------