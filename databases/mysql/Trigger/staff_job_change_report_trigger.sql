-- INSERT, UPDATE, DELETER on ticket
CREATE TRIGGER update_staff_job_change_report_after_ticket_insert
AFTER INSERT ON ticket
FOR EACH ROW
BEGIN
    INSERT INTO staff_job_change_report (
        staff_id,
        staff_first_name,
        staff_last_name,
        staff_email,
        staff_gender,
        staff_salary,
        staff_job_type,
        staff_department_name,
        staff_manager,
        ticket_id,
        created_date,
        ticket_note,
        ticket_status,
        ticket_first_name,
        ticket_last_name,
        ticket_gender,
        ticket_job_type,
        ticket_department_name,
        ticket_manager
    )
    SELECT 
        S.staff_id,
        S.first_name AS staff_first_name, 
        S.last_name AS staff_last_name, 
        S.email AS staff_email, 
        S.gender AS staff_gender,
        S.salary AS staff_salary,
        S.job_type AS staff_job_type, 
        D1.department_name AS staff_department_name,
        M1.email AS staff_manager,
        NEW.ticket_id,
        NEW.created_date,
        NEW.note AS ticket_note,
        NEW.status AS ticket_status,
        NEW.first_name AS ticket_first_name,
        NEW.last_name AS ticket_last_name,
        NEW.gender AS ticket_gender,
        NEW.job_type AS ticket_job_type,
        D2.department_name AS ticket_department_name,
        M2.email AS ticket_manager
    FROM staff S
    JOIN department D1 ON S.department_id = D1.department_id
    LEFT JOIN staff M1 ON S.manager_id = M1.staff_id
    LEFT JOIN department D2 ON NEW.department_id = D2.department_id
    LEFT JOIN staff M2 ON NEW.manager_id = M2.staff_id
    WHERE S.staff_id = NEW.creator;
END;

CREATE TRIGGER update_staff_job_change_report_after_ticket_update
AFTER UPDATE ON ticket
FOR EACH ROW
BEGIN
    UPDATE staff_job_change_report
    SET 
        ticket_note = NEW.note,
        ticket_status = NEW.status,
        ticket_first_name = NEW.first_name,
        ticket_last_name = NEW.last_name,
        ticket_gender = NEW.gender,
        ticket_job_type = NEW.job_type,
        ticket_department_name = (SELECT department_name FROM department WHERE department_id = NEW.department_id),
        ticket_manager = (SELECT email FROM staff WHERE staff_id = NEW.manager_id)
    WHERE ticket_id = NEW.ticket_id;
END;

CREATE TRIGGER update_staff_job_change_report_after_ticket_delete
AFTER DELETE ON ticket
FOR EACH ROW
BEGIN
    DELETE FROM staff_job_change_report
    WHERE ticket_id = OLD.ticket_id;
END;