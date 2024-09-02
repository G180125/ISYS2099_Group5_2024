-- INSERT, UPDATE, DELETER on user
CREATE TRIGGER update_patient_secure_view_after_user_insert
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    CALL refresh_patient_secure_view();
END;

CREATE TRIGGER update_patient_secure_view_after_user_update
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    CALL refresh_patient_secure_view();
END;

CREATE TRIGGER update_patient_secure_view_after_user_delete
AFTER DELETE ON user
FOR EACH ROW
BEGIN
    CALL refresh_patient_secure_view();
END;

-- UPDATE on patient
CREATE TRIGGER update_patient_secure_view_after_patient_update
AFTER UPDATE ON patient
FOR EACH ROW
BEGIN
    CALL refresh_patient_secure_view();
END;