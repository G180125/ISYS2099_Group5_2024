-- UPDATE, DELETER on user
CREATE TRIGGER update_staff_job_change_report_after_user_update
AFTER UPDATE ON user
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

CREATE TRIGGER update_staff_job_change_report_after_user_delete
AFTER DELETE ON user
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

-- UPDATE, DELETER on staff
CREATE TRIGGER update_staff_job_change_report_after_staff_update
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

CREATE TRIGGER update_staff_job_change_report_after_staff_delete
AFTER DELETE ON staff
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

-- UPDATE, DELETER on department
CREATE TRIGGER update_staff_job_change_report_after_department_update
AFTER UPDATE ON department
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

CREATE TRIGGER update_staff_job_change_report_after_department_delete
AFTER DELETE ON department
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

-- INSERT, UPDATE, DELETER on ticket
CREATE TRIGGER update_staff_job_change_report_after_ticket_insert
AFTER INSERT ON ticket
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

CREATE TRIGGER update_staff_job_change_report_after_ticket_update
AFTER UPDATE ON ticket
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;

CREATE TRIGGER update_staff_job_change_report_after_ticket_delete
AFTER DELETE ON ticket
FOR EACH ROW
BEGIN
    CALL refresh_staff_job_change_report();
END;
