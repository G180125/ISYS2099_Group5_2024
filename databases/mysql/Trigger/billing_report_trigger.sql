-- INSERT, UPDATE, DELETER on appointment
CREATE TRIGGER update_billing_report_after_appointment
AFTER INSERT ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_appointment_update
AFTER UPDATE ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_appointment_delete
AFTER DELETE ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

-- UPDATE, DELETER on patient
CREATE TRIGGER update_billing_report_after_patient
AFTER UPDATE ON patient
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_patient_delete
AFTER DELETE ON patient
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

-- UPDATE, DELETER on schedule
CREATE TRIGGER update_billing_report_after_schedule_update
AFTER UPDATE ON schedule
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_schedule_delete
AFTER DELETE ON schedule
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

-- UPDATE, DELETER on staff
CREATE TRIGGER update_billing_report_after_staff
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_staff_delete
AFTER DELETE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

-- UPDATE, DELETER on department
CREATE TRIGGER update_billing_report_after_department
AFTER UPDATE ON department
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_department_delete
AFTER DELETE ON department
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

-- INSERT, UPDATE, DELETER on treatment_record
CREATE TRIGGER update_billing_report_after_treatment_record
AFTER INSERT ON treatment_record
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_treatment_record_update
AFTER UPDATE ON treatment_record
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;

CREATE TRIGGER update_billing_report_after_treatment_record_delete
AFTER DELETE ON treatment_record
FOR EACH ROW
BEGIN
    CALL refresh_billing_report();
END;