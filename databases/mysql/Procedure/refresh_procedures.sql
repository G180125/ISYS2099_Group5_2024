DROP PROCEDURE IF EXISTS refresh_patient_secure_report;
CREATE PROCEDURE refresh_patient_secure_report()
BEGIN
    DELETE FROM patient_secure_report;
    SELECT 
        U.user_id patient_id,
        U.first_name patient_first_name,
        U.last_name patient_last_name,
        U.email patient_email,
        P.date_of_birth patient_dob,
        U.gender patient_gender,
        P.allergies patient_allergies
    FROM patient P
    JOIN user U ON P.patient_id = U.user_id;
END;

DROP PROCEDURE IF EXISTS refresh_staff_secure_report;
CREATE PROCEDURE refresh_staff_secure_report()
BEGIN
    DELETE FROM staff_secure_report;
    SELECT 
        S.user_id staff_id,
        U.first_name,
        U.last_name,
        U.email,
        U.gender,
        S.job_type,
        D.department_id,
        D.department_name,
        D.manager_id
    FROM staff S
    JOIN user U ON U.user_id = S.user_id
    LEFT JOIN department D ON S.department_id = D.department_id;
END;

DROP PROCEDURE IF EXISTS refresh_treatment_report;
CREATE PROCEDURE refresh_treatment_report()
BEGIN
    DELETE FROM treatment_report;
    INSERT INTO treatment_report
    SELECT  P.patient_id,
        P.first_name AS patient_first_name, 
        P.last_name AS patient_last_name, 
        P.email AS patient_email,
        TR.treatment_id,
        T.treatment_name, 
        TR.treatment_date, 
        TR.status treatment_status,
        ST.first_name AS staff_first_name, 
        ST.last_name AS staff_last_name, 
        ST.job_type, 
        D.department_name
    FROM treatment_record TR
    JOIN treatment T ON TR.treatment_id = T.treatment_id
    JOIN appointment A ON TR.appointment_id = A.appointment_id
    JOIN patient_secure_report P ON A.patient_id = P.patient_id
    JOIN schedule S ON A.schedule_id = S.schedule_id
    JOIN staff_secure_report ST ON S.staff_id = ST.staff_id
    JOIN department D ON ST.department_id = D.department_id
    ORDER BY TR.status;
END;

DROP PROCEDURE IF EXISTS refresh_doctor_work_report;
CREATE PROCEDURE refresh_doctor_work_report()
BEGIN
    DELETE FROM doctor_work_report;
    INSERT INTO doctor_work_report
    SELECT ST.first_name, 
        ST.last_name, 
        ST.email,
        ST.gender, 
        ST.job_type, 
        S.schedule_date,
        A.slot_number time, 
        D.department_name,
        P.first_name, 
        P.last_name,
        A.status appointment_status
    FROM appointment A
    JOIN patient_secure_report P ON A.patient_id = P.patient_id
    JOIN schedule S ON A.schedule_id = S.schedule_id
    JOIN staff_secure_report ST ON S.staff_id = ST.staff_id
    JOIN department D ON ST.department_id = D.department_id
    ORDER BY S.schedule_date;
END;

DROP PROCEDURE IF EXISTS refresh_billing_report;
CREATE PROCEDURE refresh_billing_report()
BEGIN
    DELETE FROM billing_report;
    INSERT INTO billing_report
    SELECT A.appointment_id,
       S.schedule_date AS appointment_date,
       A.slot_number AS time,
       A.status AS appointment_status,
       A.purpose,
       ST.first_name AS staff_first_name,
       ST.last_name AS staff_last_name,
       D.department_name,
       P.first_name AS patient_first_name,
       P.last_name AS patient_last_name,
       COALESCE(SUM(T.treatment_cost), 0) AS total_cost
    FROM appointment A
    JOIN patient_secure_report P ON A.patient_id = P.patient_id
    JOIN schedule S ON A.schedule_id = S.schedule_id
    JOIN staff_secure_report ST ON S.staff_id = ST.staff_id
    JOIN department D ON ST.department_id = D.department_id
    LEFT JOIN treatment_record TR ON A.appointment_id = TR.appointment_id
    LEFT JOIN treatment T ON TR.treatment_id = T.treatment_id
    GROUP BY 
        A.appointment_id,
        S.schedule_date,
        A.slot_number,
        A.status,
        A.purpose,
        ST.first_name,
        ST.last_name,
        D.department_name,
        P.first_name,
        P.last_name;
END;


DROP PROCEDURE IF EXISTS refresh_doctor_free_slot_report;
CREATE PROCEDURE refresh_doctor_free_slot_report()
BEGIN
    DELETE FROM doctor_free_slot_report;
    INSERT INTO doctor_free_slot_report
    SELECT 
        ST.staff_id,
        ST.first_name AS staff_first_name,
        ST.last_name AS staff_last_name,
        S.schedule_date,
        MAX(CASE WHEN N.slot_number = 1 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '09:00-10:00',
        MAX(CASE WHEN N.slot_number = 2 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '10:00-11:00',
        MAX(CASE WHEN N.slot_number = 3 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '11:00-12:00',
        MAX(CASE WHEN N.slot_number = 4 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '12:00-13:00',
        MAX(CASE WHEN N.slot_number = 5 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '13:00-14:00',
        MAX(CASE WHEN N.slot_number = 6 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '14:00-15:00',
        MAX(CASE WHEN N.slot_number = 7 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '15:00-16:00',
        MAX(CASE WHEN N.slot_number = 8 THEN 
            CASE WHEN A.slot_number IS NULL THEN 'available' ELSE 'busy' END END) AS '16:00-17:00'
    FROM staff ST
    JOIN schedule S ON S.staff_id = ST.staff_id
    CROSS JOIN (
        SELECT 1 AS slot_number UNION ALL
        SELECT 2 UNION ALL
        SELECT 3 UNION ALL
        SELECT 4 UNION ALL
        SELECT 5 UNION ALL
        SELECT 6 UNION ALL
        SELECT 7 UNION ALL
        SELECT 8
    ) N
    LEFT JOIN appointment A ON A.schedule_id = S.schedule_id AND A.slot_number = N.slot_number
    WHERE ST.job_type = 'D'
    GROUP BY ST.staff_id, ST.first_name, ST.last_name, S.schedule_date
    ORDER BY S.schedule_date;
END;
