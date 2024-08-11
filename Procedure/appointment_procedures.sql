----------------------- Procedure to view working schedule of all doctors for a given duration -----------------------
/*
Description:
This procedure retrieves the working schedules of all doctors within a specified date and time range, and also indicates whether each doctor is busy or available during that time.
*/
DROP PROCEDURE IF EXISTS view_all_doctor_schedules_in_duration;
DELIMITER //
CREATE PROCEDURE view_all_doctor_schedules_in_duration(
    IN a_start_date DATE,
    IN a_start_time TIME, 
    IN a_end_date DATE,
    IN a_end_time TIME
)
BEGIN
    SELECT *
        CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM appointment a2
                WHERE a2.doctor_id = a.doctor_id
                AND (
                    (a2.appointment_date > a_start_date OR (a2.appointment_date = a_start_date AND a2.appointment_time >= a_start_time))
                    AND
                    (a2.appointment_date < a_end_date OR (a2.appointment_date = a_end_date AND a2.appointment_time <= a_end_time))
                )
            ) THEN 'Busy'
            ELSE 'Available'
        END AS doctor_status
    FROM 
        appointment a
    WHERE 
        (a.appointment_date > a_start_date OR (a.appointment_date = a_start_date AND a.appointment_time >= a_start_time))
        AND
        (a.appointment_date < a_end_date OR (a.appointment_date = a_end_date AND a.appointment_time <= a_end_time))
    ORDER BY 
        a.appointment_date, 
        a.appointment_time;
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
    DECLARE v_conflict_count INT;

    START TRANSACTION;

    -- Check if the patient or doctor already has an appointment during this time
    SELECT COUNT(*) INTO v_conflict_count
    FROM appointment
    WHERE 
        (appointment_date = a_appointment_date)
        AND (
            -- If the new appointment start time falls within an existing appointment.
            (a_appointment_time BETWEEN appointment_time AND ADDTIME(appointment_time, '01:00:00'))
            OR
            -- If the new appointment end time falls within an existing appointment.
            (ADDTIME(a_appointment_time, '01:00:00') BETWEEN appointment_time AND ADDTIME(appointment_time, '01:00:00'))
            OR
            -- If an existing appointment starts between the new appointment start and end time.
            (appointment_time BETWEEN a_appointment_time AND ADDTIME(a_appointment_time, '01:00:00'))
        )
        AND (patient_id = a_patient_id OR doctor_id = a_doctor_id);

    -- If there's a conflict, rollback and exit
    IF v_conflict_count > 0 THEN
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- If no conflicts, insert the new appointment
    INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, purpose)
    VALUES (a_patient_id, a_doctor_id, a_appointment_date, a_appointment_time, a_purpose);

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
this_proc:
BEGIN
    DECLARE v_appointment_time DATETIME;
    DECLARE v_conflict_count INT;

    START TRANSACTION;

    -- Check if the patient owns the appointment and if it's at least an hour away
    SELECT COUNT(*), CONCAT(appointment_date, ' ', appointment_time) INTO v_conflict_count, v_appointment_time
    FROM appointment
    WHERE 
        appointment_id = a_appointment_id 
        AND patient_id = a_patient_id
        AND TIMESTAMP(appointment_date, appointment_time) >= ADDTIME(NOW(), '01:00:00')
    FOR UPDATE;

    IF v_conflict_count = 0 THEN
        -- If the appointment is not found, or is less than an hour away, rollback and exit
        ROLLBACK;
        LEAVE this_proc;
    END IF;

    -- Delete the appointment
    DELETE FROM appointment
    WHERE appointment_id = a_appointment_id;

    COMMIT;
END //
DELIMITER ;

---------------------- Procedure to add a note ----------------------