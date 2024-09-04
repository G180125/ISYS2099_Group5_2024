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
    OUT message VARCHAR(255),
    OUT new_staff_id INT
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
        SET new_staff_id = LAST_INSERT_ID(); 
        SET message = 'Registration successful';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message, new_staff_id;
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
    SELECT * FROM staff_secure_report 
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
        SELECT * FROM staff_secure_report
        ORDER BY first_name, last_name ASC
        LIMIT p_limit OFFSET p_offset;
    ELSE
        SELECT * FROM staff_secure_report
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
CREATE PROCEDURE update_staff(
    IN s_id INT,
    IN s_first_name VARCHAR(100),
    IN s_last_name VARCHAR(100),
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

    -- Check if the staff exists
    IF (SELECT COUNT(*) FROM staff WHERE staff_id = s_id) = 0 THEN
        SET result = 0;
        SET message = 'Staff member not found';
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Begin the update using COALESCE to update only if the parameter is not null
    UPDATE staff
    SET 
        first_name = COALESCE(s_first_name, first_name),
        last_name = COALESCE(s_last_name, last_name),
        gender = COALESCE(s_gender, gender),
        job_type = COALESCE(s_job_type, job_type),
        department_id = COALESCE(s_department_id, department_id),
        salary = COALESCE(s_salary, salary),
        manager_id = COALESCE(s_manager_id, manager_id)
    WHERE staff_id = s_id;

    -- Check if there was an error during the update
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET message = 'Update successful';
        COMMIT;
    END IF;

    -- Return the result and message
    SELECT result, message;
END;

DROP PROCEDURE IF EXISTS view_staff_schedule;
-- DELIMITER //
CREATE PROCEDURE view_staff_schedule(
    IN p_staff_id INT,
    IN s_limit INT,
    IN s_offset INT        
)
BEGIN
    SELECT *
    FROM doctor_free_slot_report
    WHERE staff_id = p_staff_id
    ORDER BY schedule_date
    LIMIT s_limit OFFSET s_offset;
END;


DROP PROCEDURE IF EXISTS `update_appointment`;
CREATE PROCEDURE update_appointment(
    IN a_appointment_id INT,
    IN a_update_date DATE,
    IN a_slot_number INT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN 
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);
    DECLARE current_doctor_id INT;
    DECLARE available_schedule_id INT;
    DECLARE current_patient_id INT;

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
    
    -- Retrieve current doctor and patient information in a single query
    SELECT S.staff_id, A.patient_id
    INTO current_doctor_id, current_patient_id
    FROM appointment A
    JOIN schedule S ON S.schedule_id = A.schedule_id
    WHERE A.appointment_id = a_appointment_id;
    
    -- Validate doctor existence
    IF current_doctor_id IS NULL THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'No Doctor Found!';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;
    
    -- Check for the doctor's availability on the updated date
    SELECT schedule_id INTO available_schedule_id
    FROM schedule
    WHERE schedule_date = a_update_date
    AND staff_id = current_doctor_id;

    IF available_schedule_id IS NULL THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'This doctor does not have a working schedule on this date';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;

    -- Check for conflicting patient appointments at the specified slot number
    IF EXISTS (
        SELECT 1
        FROM appointment A
        JOIN schedule S ON S.schedule_id = A.schedule_id
        WHERE S.schedule_date = a_update_date 
        AND A.patient_id = current_patient_id
        AND A.slot_number = a_slot_number
    ) THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'This patient has an appointment at this time';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;

    -- Check for conflicting doctor appointments at the specified slot number
    IF EXISTS (
        SELECT 1
        FROM appointment A
        JOIN schedule S ON S.schedule_id = A.schedule_id
        WHERE S.schedule_date = a_update_date 
        AND S.staff_id = current_doctor_id
        AND A.slot_number = a_slot_number
    ) THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'This doctor is busy at this time';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;

    -- Lock the appointment row for update and perform the update
    UPDATE appointment
    SET schedule_id = available_schedule_id, slot_number = a_slot_number
    WHERE appointment_id = a_appointment_id;
    
    -- Commit or rollback based on the transaction status
    IF _rollback THEN
        ROLLBACK;
    ELSE 
        COMMIT;
        SET result = 1;
        SET message = 'Appointment updated successfully';
    END IF;

    -- Return the result and message
    SELECT result, message;
END;