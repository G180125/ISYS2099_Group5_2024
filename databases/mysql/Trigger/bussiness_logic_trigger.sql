CREATE TRIGGER before_finish_appointment
BEFORE UPDATE ON appointment
FOR EACH ROW
BEGIN
    DECLARE treatments_upcoming INT;

    -- Check if the new status is being updated to 'F' (finished)
    IF NEW.status = 'F' THEN
        -- Count the number of treatment records that are upcoming (status - 'U') for the appointment
        SELECT COUNT(*)
        INTO treatments_upcoming
        FROM treatment_record
        WHERE appointment_id = NEW.appointment_id
        AND status = 'U';

        -- If there are any treatment records that are not finished, raise an error
        IF treatments_upcoming > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot finish appointment. Not all treatments are completed.';
        END IF;
    END IF;
END;

CREATE TRIGGER before_insert_schedule
BEFORE INSERT ON schedule
FOR EACH ROW
BEGIN
    DECLARE doctor_count INT;
    DECLARE nurse_count INT;

    -- Count the number of doctors already scheduled for the same department and day
    SELECT COUNT(*)
    INTO doctor_count
    FROM schedule S
    JOIN staff ST ON S.staff_id = ST.user_id
    WHERE ST.job_type = 'D'
    AND ST.department_id = (SELECT department_id FROM staff WHERE user_id = NEW.staff_id)
    AND S.schedule_date = NEW.schedule_date;

    -- Count the number of nurses already scheduled for the same department and day
    SELECT COUNT(*)
    INTO nurse_count
    FROM schedule S
    JOIN staff ST ON S.staff_id = ST.user_id
    WHERE ST.job_type = 'N'
    AND ST.department_id = (SELECT department_id FROM staff WHERE user_id = NEW.staff_id)
    AND S.schedule_date = NEW.schedule_date;

    -- Check if inserting the new schedule exceeds the allowed limit of doctors or nurses
    IF (SELECT job_type FROM staff WHERE user_id = NEW.staff_id) = 'D' AND doctor_count >= 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot schedule more than 2 doctors for the same department on the same day.';
    END IF;

    IF (SELECT job_type FROM staff WHERE user_id = NEW.staff_id) = 'N' AND nurse_count >= 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot schedule more than 2 nurses for the same department on the same day.';
    END IF;
END;