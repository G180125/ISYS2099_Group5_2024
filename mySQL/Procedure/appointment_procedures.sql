----------------------- Procedure to view working schedule of all doctors for a given duration -----------------------
/*
Description:
This procedure retrieves the working schedules of all doctors within a specified date and time range, and also indicates whether each doctor is busy or available during that time.
*/
DROP PROCEDURE IF EXISTS view_all_doctor_schedules_in_duration;
DELIMITER //
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
END //
DELIMITER ;

---------------------- Procedure to book an appointment with doctor ----------------------
DROP PROCEDURE IF EXISTS book_an_appointment;
DELIMITER //
CREATE PROCEDURE book_an_appointment(
    IN a_patient_id INT,
    IN a_doctor_id INT,
    IN a_appointment_date DATE,
    IN a_appointment_time TIME,
    IN a_purpose TEXT
)
this_proc:
BEGIN
    DECLARE v_schedule_id INT;
    DECLARE v_appointment_end_time TIME;

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
        ROLLBACK;
        SELECT CONCAT('This doctor does not have the working schedule on ', a_appointment_date, '.') AS message;
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
        ROLLBACK;
        SELECT CONCAT('This doctor is busy at ', a_appointment_time, '.' ) AS message;
        LEAVE this_proc;
    END IF;

    -- If no conflicts, insert the new appointment
    INSERT INTO appointment (patient_id, schedule_id, start_time, end_time, purpose)
    VALUES (a_patient_id, v_schedule_id, a_appointment_time, v_appointment_end_time, a_purpose);

    COMMIT;

    -- Return the new appointment ID
    SELECT LAST_INSERT_ID() AS new_appointment_id;
END //
DELIMITER ;


---------------------- Procedure to cancel an appointment with doctor ----------------------
DROP PROCEDURE IF EXISTS cancel_an_appointment;
DELIMITER //
CREATE PROCEDURE cancel_an_appointment(
    IN a_patient_id INT,
    IN a_appointment_id INT
)
BEGIN
    -- Check if the appointment exists for the given patient and appointment ID
    IF EXISTS (
        SELECT 1
        FROM appointment
        WHERE appointment_id = a_appointment_id AND patient_id = a_patient_id
    ) THEN
        -- If found, delete the appointment
        DELETE FROM appointment
        WHERE appointment_id = a_appointment_id AND patient_id = a_patient_id;

        COMMIT;
        
        SELECT CONCAT('Appointment has been canceled.') AS message;
    ELSE
        -- If not found, rollback and return an error message
        ROLLBACK;
        SELECT CONCAT('You do not have the permission to cancel this appointment') AS message;
    END IF;
END //
DELIMITER ;

---------------------- Procedure to add a note ----------------------