/*
Description:
This procedure retrieves the working schedules of all doctors within a specified date and time range, and also indicates whether each doctor is busy or available during that time.
*/
DROP PROCEDURE IF EXISTS view_all_doctor_schedules_in_duration;
CREATE PROCEDURE view_all_doctor_schedules_in_duration(
    IN a_date DATE,
    IN a_start_time TIME, 
    IN a_end_time TIME
)
BEGIN
    -- Get all doctors who are scheduled on the specified date
    SELECT
        s.staff_id,
        CONCAT(st.first_name, ' ', st.last_name) AS doctor_name,
        CASE
            WHEN ap.appointment_id IS NOT NULL THEN 'Busy'
            WHEN sch.schedule_id IS NULL THEN 'Day Off'
            ELSE 'Available'
        END AS status
    FROM
        staff st
    LEFT JOIN
        schedule sch ON st.staff_id = sch.staff_id AND sch.schedule_date = a_date
    LEFT JOIN
        appointment ap ON sch.schedule_id = ap.schedule_id AND ap.start_time >= a_start_time AND ap.end_time <= a_end_time
    WHERE
        st.job_type = 'D';
END;

DROP PROCEDURE IF EXISTS book_an_appointment;
CREATE PROCEDURE book_an_appointment(
    IN a_patient_id INT,
    IN a_doctor_id INT,
    IN a_date DATE,
    IN a_slot_number INT,
    IN a_purpose TEXT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);
    DECLARE available_schedule_id INT;

    -- Declare the handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET _rollback = 1;
        SET result = 0;
        SET message = sql_error_message;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Check for the doctor's availability on the updated date
    SELECT schedule_id INTO available_schedule_id
    FROM schedule
    WHERE schedule_date = a_date
    AND staff_id = a_doctor_id;

    IF available_schedule_id IS NULL THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'This doctor does not have a working schedule on this date';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;

    -- Check for conflicting patient appointments at the specified slot number
    IF EXISTS (
        SELECT 1
        FROM appointment A
        JOIN schedule S ON S.schedule_id = A.schedule_id
        WHERE S.schedule_date = a_date 
        AND A.patient_id = a_patient_id
        AND A.slot_number = a_slot_number
    ) THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'This patient has an appointment at this time';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;

    -- Check for conflicting doctor appointments at the specified slot number
    IF EXISTS (
        SELECT 1
        FROM appointment A
        JOIN schedule S ON S.schedule_id = A.schedule_id
        WHERE S.schedule_date = a_date 
        AND S.staff_id = a_doctor_id
        AND A.slot_number = a_slot_number
    ) THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'This doctor is busy at this time';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;

    -- If no conflicts, insert the new appointment
    INSERT INTO appointment (patient_id, schedule_id, slot_number, purpose, status)
    VALUES (a_patient_id, available_schedule_id, a_slot_number, a_purpose, 'U');

    IF _rollback THEN
        SET result = 0;
        ROLLBACK;   
    ELSE
        SET result = 1;
        SET message = 'Appointment booked successfully.';
        COMMIT;
    END IF;

    SELECT result, message;
END;



DROP PROCEDURE IF EXISTS `cancel_appointment`;

CREATE PROCEDURE cancel_appointment(
    IN a_appointment_id INT,
    IN a_patient_id INT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE _rollback BOOL DEFAULT 0;
    DECLARE sql_error_message VARCHAR(255);

    -- Declare the handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 sql_error_message = MESSAGE_TEXT;
        SET _rollback = 1;
        SET result = 0;
        SET message = sql_error_message;
        ROLLBACK;
        SELECT result, message;
    END;

    START TRANSACTION;
    
    -- Check if the appointment exists, belongs to the patient, and is not already canceled
    IF NOT EXISTS (
        SELECT 1
        FROM appointment A
        WHERE A.appointment_id = a_appointment_id 
        AND A.patient_id = a_patient_id
        AND A.status <> 'C'
        FOR UPDATE
    ) THEN
        SET _rollback = 1;
        SET result = 0;
        SET message = 'The appointment is not found, already canceled, or does not belong to the patient';
        ROLLBACK;
        SELECT result, message;
        LEAVE this_proc;
    END IF;
   
    -- Update the appointment status to 'C' (canceled)
    UPDATE appointment
    SET status = 'C'
    WHERE appointment_id = a_appointment_id;
   
    -- Commit or rollback based on the transaction status
    IF _rollback THEN
        ROLLBACK;
    ELSE 
        COMMIT;
        SET result = 1;
        SET message = 'Appointment canceled successfully';
    END IF;

    -- Return the result and message
    SELECT result, message;
END;
