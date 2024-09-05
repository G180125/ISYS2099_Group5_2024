-- INSERT, UPDATE, DELETER on appointment
CREATE TRIGGER update_doctor_free_slot_report_after_appointment
AFTER INSERT ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_doctor_free_slot_report();
END;

CREATE TRIGGER update_doctor_free_slot_report_after_appointment_update
AFTER UPDATE ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_doctor_free_slot_report();
END;

CREATE TRIGGER update_doctor_free_slot_report_after_appointment_delete
AFTER DELETE ON appointment
FOR EACH ROW
BEGIN
    CALL refresh_doctor_free_slot_report();
END;

-- INSERT, UPDATE, DELETER on schedule
CREATE TRIGGER update_doctor_free_slot_report_after_schedule_update
AFTER INSERT ON schedule
FOR EACH ROW
BEGIN
    CALL refresh_doctor_free_slot_report();
END;

CREATE TRIGGER update_doctor_free_slot_report_after_schedule_update
AFTER UPDATE ON schedule
FOR EACH ROW
BEGIN
    CALL refresh_doctor_free_slot_report();
END;

CREATE TRIGGER update_doctor_free_slot_report_after_schedule_delete
AFTER DELETE ON schedule
FOR EACH ROW
BEGIN
    CALL refresh_doctor_free_slot_report();
END;