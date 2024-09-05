-- INSERT, UPDATE, DELETER on staff
CREATE TRIGGER update_staff_secure_report_after_staff_insert
AFTER INSERT ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_report();
END;

CREATE TRIGGER update_staff_secure_report_after_staff_update
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_report();
END;

CREATE TRIGGER update_staff_secure_report_after_staff_delete
AFTER DELETE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_secure_report();
END;