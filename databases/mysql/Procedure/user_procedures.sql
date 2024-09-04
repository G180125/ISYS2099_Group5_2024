DROP PROCEDURE IF EXISTS add_new_user;
CREATE PROCEDURE add_new_user(
    IN u_first_name VARCHAR(100),
    IN u_last_name VARCHAR(100),
    IN u_email VARCHAR(100),
    IN u_password VARCHAR(100),
    IN u_gender ENUM('M', 'F', 'O'),
    OUT result INT,
    OUT message VARCHAR(255),
    OUT new_user_id INT  
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

    -- Insert the new user record
    INSERT INTO user (first_name, last_name, email, password, gender)
    VALUES (u_first_name, u_last_name, u_email, u_password, u_gender);

    -- Final check before committing the transaction
    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET new_user_id = LAST_INSERT_ID(); 
        COMMIT;
        SET message = 'User added successfully';
    END IF;
END;

DROP PROCEDURE IF EXISTS update_user;
CREATE PROCEDURE update_user(
    IN u_id INT,
    IN u_first_name VARCHAR(100),
    IN u_last_name VARCHAR(100),
    IN u_gender ENUM('M', 'F', 'O'),
    OUT result INT,
    OUT message VARCHAR(255)
)
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

    -- Update the user record
    UPDATE user
    SET first_name = u_first_name,
        last_name = u_last_name,
        gender = u_gender
    WHERE user_id = u_id;

    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET message = 'User updated successfully';
        COMMIT;
    END IF;
END;

DROP PROCEDURE IF EXISTS get_user_role_by_email;
CREATE PROCEDURE get_user_role_by_email(
    IN p_email VARCHAR(100),
    OUT role VARCHAR(50),
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE user_id INT DEFAULT NULL;
    DECLARE staff_role ENUM('Admin', 'Doctor', 'Nurse');
    DECLARE sql_error_message VARCHAR(255);

     -- Handle SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET role = NULL;
        SET message = sql_error_message;
    END;

    -- Check if the email exists in the user table
    SELECT user_id INTO user_id
    FROM user
    WHERE email = p_email;

    IF user_id IS NULL THEN
        SET role = NULL;
        SET message = "No User Found";
        SELECT role, message;
        LEAVE this_proc;
    END IF;

    IF EXISTS (SELECT 1 FROM patient WHERE user_id = user_id)THEN
        SET role = 'patient';
        SELECT role, message;
        LEAVE this_proc;
    END IF;

    IF EXISTS (SELECT 1 FROM staff WHERE user_id = user_id AND job_type = 'a') THEN
        SET role = 'admin';
        SELECT role, message;
        LEAVE this_proc;
    END IF;

    SET role = 'staff';
    SELECT role, message;
END; 
