-- Trigger for inserts on the staff table
CREATE TRIGGER staff_insert_trigger
AFTER INSERT ON staff
FOR EACH ROW
BEGIN
    INSERT INTO staff_secure_report
    (staff_id, first_name, last_name, email, gender, job_type, department_id, department_name, manager_id)
    VALUES (NEW.user_id, 
            (SELECT first_name FROM user WHERE user_id = NEW.user_id),
            (SELECT last_name FROM user WHERE user_id = NEW.user_id),
            (SELECT email FROM user WHERE user_id = NEW.user_id),
            (SELECT gender FROM user WHERE user_id = NEW.user_id),
            NEW.job_type, 
            NEW.department_id,
            (SELECT department_name FROM department WHERE department_id = NEW.department_id),
            (SELECT manager_id FROM department WHERE department_id = NEW.department_id));
END;

-- Trigger for updates on the staff table
CREATE TRIGGER staff_update_trigger
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    UPDATE staff_secure_report
    SET first_name = (SELECT first_name FROM user WHERE user_id = NEW.user_id),
        last_name = (SELECT last_name FROM user WHERE user_id = NEW.user_id),
        email = (SELECT email FROM user WHERE user_id = NEW.user_id),
        gender = (SELECT gender FROM user WHERE user_id = NEW.user_id),
        job_type = NEW.job_type,
        department_id = NEW.department_id,
        department_name = (SELECT department_name FROM department WHERE department_id = NEW.department_id),
        manager_id = (SELECT manager_id FROM department WHERE department_id = NEW.department_id)
    WHERE staff_id = NEW.user_id;
END;

-- Trigger for updates on the user table
CREATE TRIGGER staff_user_update_trigger
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    UPDATE staff_secure_report
    SET first_name = NEW.first_name,
        last_name = NEW.last_name,
        email = NEW.email,
        gender = NEW.gender
    WHERE staff_id = NEW.user_id;
END;

-- Trigger for updates on the department table
CREATE TRIGGER department_update_trigger
AFTER UPDATE ON department
FOR EACH ROW
BEGIN
    UPDATE staff_secure_report
    SET department_name = NEW.department_name,
        manager_id = NEW.manager_id
    WHERE department_id = NEW.department_id;
END;

-- Trigger for deletes on the patient table
CREATE TRIGGER user_delete_trigger1
AFTER DELETE ON user
FOR EACH ROW
BEGIN
    DELETE FROM patient_secure_report
    WHERE patient_id = OLD.user_id;
END;