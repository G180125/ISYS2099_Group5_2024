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
    IN a_appointment_date DATE,
    IN a_appointment_time TIME,
    IN a_purpose TEXT,
    OUT result INT,
    OUT message VARCHAR(255)
)
this_proc:
BEGIN
    DECLARE v_schedule_id INT;
    DECLARE v_appointment_end_time TIME;

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
    END;

    -- Calculate appointment end time assuming a 1-hour duration (adjust as needed)
    SET v_appointment_end_time = ADDTIME(a_appointment_time, '01:00:00');

    START TRANSACTION;

    -- Check if the doctor has a working schedule on the specified date and lock the row
    SELECT s.schedule_id INTO v_schedule_id
    FROM schedule s
    WHERE s.staff_id = a_doctor_id AND s.schedule_date = a_appointment_date
    FOR UPDATE;

    -- If the doctor doesn't have a schedule for that day, rollback and exit
    IF v_schedule_id IS NULL THEN
        SET result = 0;
        SET message = CONCAT('This doctor does not have a working schedule on ', a_appointment_date, '.');
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Check for any appointment conflicts and lock the rows if found
    IF EXISTS (
        SELECT 1
        FROM appointment a
        WHERE a.schedule_id = v_schedule_id
        AND a_appointment_time < a.end_time
        AND v_appointment_end_time > a.start_time
        FOR UPDATE
    ) THEN
        SET result = 0;
        SET message = CONCAT('This doctor is busy at ', a_appointment_time, '.');
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- If no conflicts, insert the new appointment
    INSERT INTO appointment (patient_id, schedule_id, start_time, end_time, purpose)
    VALUES (a_patient_id, v_schedule_id, a_appointment_time, v_appointment_end_time, a_purpose);

    IF _rollback THEN
        SET result = 0;
        ROLLBACK;
    ELSE
        SET result = 1;
        SET message = 'Appointment booked successfully.';
        COMMIT;
    END IF;

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