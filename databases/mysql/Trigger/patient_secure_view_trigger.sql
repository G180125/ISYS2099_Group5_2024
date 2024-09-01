-- INSERT, UPDATE, DELETER on patient
CREATE TRIGGER update_patient_secure_view_after_patient_insert
AFTER INSERT ON patient
FOR EACH ROW
BEGIN
    CALL refresh_patient_secure_view();
END;

CREATE TRIGGER update_patient_secure_view_after_patient_update
AFTER UPDATE ON patient
FOR EACH ROW
BEGIN
    CALL refresh_patient_secure_view();
END;

CREATE TRIGGER update_patient_secure_view_after_patient_delete
AFTER DELETE ON patient
FOR EACH ROW
BEGIN
    CALL refresh_patient_secure_view();
END;