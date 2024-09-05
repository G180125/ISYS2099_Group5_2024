-- INSERT, UPDATE, DELETER on appointment
CREATE TRIGGER update_doctor_work_report_after_appointment_insert
AFTER INSERT ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

CREATE TRIGGER update_doctor_work_report_after_appointment_update
AFTER UPDATE ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

CREATE TRIGGER update_doctor_work_report_after_appointment_delete
AFTER DELETE ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

-- UPDATE, DELETER on schedule
CREATE TRIGGER update_doctor_work_report_after_schedule_update
AFTER UPDATE ON schedule
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

CREATE TRIGGER update_doctor_work_report_after_schedule_delete
AFTER DELETE ON schedule
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

-- UPDATE, DELETER on user
CREATE TRIGGER update_doctor_work_report_after_user_update
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

CREATE TRIGGER update_doctor_work_report_after_user_delete
AFTER DELETE ON user
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

-- UPDATE, DELETER on patient
CREATE TRIGGER update_doctor_work_report_after_patient_update
AFTER UPDATE ON patient
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

CREATE TRIGGER update_doctor_work_report_after_patient_delete
AFTER DELETE ON patient
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

-- UPDATE, DELETER on staff
CREATE TRIGGER update_doctor_work_report_after_staff_update
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

CREATE TRIGGER update_doctor_work_report_after_staff_delete
AFTER DELETE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

-- UPDATE, DELETER on department
CREATE TRIGGER update_doctor_work_report_after_department_update
AFTER UPDATE ON department
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;

CREATE TRIGGER update_doctor_work_report_after_department_delete
AFTER DELETE ON department
FOR EACH ROW
BEGIN
    CALL refresh_doctor_work_report();
END;