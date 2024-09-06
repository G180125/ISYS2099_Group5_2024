-- Trigger for inserts on the patient table
CREATE TRIGGER patient_insert_trigger
AFTER INSERT ON patient
FOR EACH ROW
BEGIN
    INSERT INTO patient_secure_report
    (patient_id, first_name, last_name, email, date_of_birth, gender, allergies)
    VALUES (NEW.user_id, 
            (SELECT first_name FROM user WHERE user_id = NEW.user_id),
            (SELECT last_name FROM user WHERE user_id = NEW.user_id),
            (SELECT email FROM user WHERE user_id = NEW.user_id),
            NEW.date_of_birth, 
            (SELECT gender FROM user WHERE user_id = NEW.user_id),
            NEW.allergies);
END;

-- Trigger for updates on the patient table
CREATE TRIGGER patient_update_trigger
AFTER UPDATE ON patient
FOR EACH ROW
BEGIN
    UPDATE patient_secure_report
    SET first_name = (SELECT first_name FROM user WHERE user_id = NEW.user_id),
        last_name = (SELECT last_name FROM user WHERE user_id = NEW.user_id),
        email = (SELECT email FROM user WHERE user_id = NEW.user_id),
        gender = (SELECT gender FROM user WHERE user_id = NEW.user_id),
        date_of_birth = NEW.date_of_birth,
        allergies = NEW.allergies
    WHERE patient_id = NEW.user_id;
END;

-- Trigger for deletes on the patient table
CREATE TRIGGER patient_delete_trigger
AFTER DELETE ON patient
FOR EACH ROW
BEGIN
    DELETE FROM patient_secure_report
    WHERE patient_id = OLD.user_id;
END;

-- Trigger for updates on the user table
CREATE TRIGGER patient_user_update_trigger
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    UPDATE patient_secure_report
    SET first_name = NEW.first_name,
        last_name = NEW.last_name,
        email = NEW.email,
        gender = NEW.gender
    WHERE patient_id = NEW.user_id;
END;
