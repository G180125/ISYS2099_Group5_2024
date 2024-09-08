DROP TABLE IF EXISTS patient_secure_report;
CREATE TABLE patient_secure_report AS
SELECT 
    P.user_id patient_id,
    U.first_name,
    U.last_name,
    U.email,
    P.date_of_birth,
    U.gender,
    P.allergies
FROM patient P
JOIN user U ON U.user_id = P.user_id;

DROP TABLE IF EXISTS staff_secure_report;
CREATE TABLE staff_secure_report AS
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

DROP TABLE IF EXISTS treatment_report;
CREATE TABLE treatment_report AS
SELECT  A.appointment_id,
		P.patient_id,
        P.first_name AS patient_first_name, 
        P.last_name AS patient_last_name, 
        P.email AS patient_email,
        TR.status AS treatment_status,
        ST.first_name AS staff_first_name, 
        ST.last_name AS staff_last_name, 
        ST.job_type, 
        D.department_name,
        TR.record_id,
        T.treatment_name, 
        TR.treatment_date,
        T.treatment_cost
FROM treatment_record TR
JOIN treatment T ON T.treatment_id = TR.treatment_id
JOIN appointment A ON TR.appointment_id = A.appointment_id
JOIN patient_secure_report P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff_secure_report ST ON S.staff_id = ST.staff_id
JOIN department D ON ST.department_id = D.department_id
GROUP BY A.appointment_id,
		P.patient_id,
        P.first_name , 
        P.last_name, 
        P.email,
        TR.status,
        ST.first_name, 
        ST.last_name, 
        ST.job_type, 
        D.department_name,
        TR.record_id, 
        T.treatment_name, 
        TR.treatment_date,
        T.treatment_cost;

DROP TABLE IF EXISTS staff_job_change_report;
CREATE TABLE staff_job_change_report AS
SELECT 
    S.staff_id,
    S.first_name AS staff_first_name, 
    S.last_name AS staff_last_name, 
    S.email AS staff_email, 
    S.gender AS staff_gender,
    ST.salary AS staff_salary,
    S.job_type AS staff_job_type, 
    M1.department_name AS staff_department_name,
    S.manager_id AS staff_manager,
    T.ticket_id,
    T.created_date,
    T.note AS ticket_note,
    T.status AS ticket_status,
    T.first_name AS ticket_first_name,
    T.last_name AS ticket_last_name,
    T.gender AS ticket_gender,
    T.job_type AS ticket_job_type,
    T.salary AS ticket_salary,
    D.department_name AS ticket_department_name,
    D.manager_id AS ticket_manager
FROM ticket T
JOIN staff_secure_report S ON T.creator = S.staff_id
JOIN staff ST ON T.creator = ST.user_id
LEFT JOIN staff_secure_report M1 ON S.manager_id = M1.staff_id
LEFT JOIN department D ON T.department_id = D.department_id
ORDER BY T.created_date;

DROP TABLE IF EXISTS doctor_work_report;
CREATE TABLE doctor_work_report AS
SELECT ST.first_name staff_first_name, 
       ST.last_name staff_last_name, 
       ST.email,
       ST.gender, 
       ST.job_type, 
       S.schedule_date,
       A.slot_number time, 
       D.department_name,
       P.first_name patient_first_name, 
       P.last_name patient_last_name,
       A.status appointment_status
FROM appointment A
JOIN patient_secure_report P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff_secure_report ST ON S.staff_id = ST.staff_id
JOIN department D ON ST.department_id = D.department_id
ORDER BY S.schedule_date;

DROP TABLE IF EXISTS billing_report;
CREATE TABLE billing_report AS
SELECT 
    A.appointment_id,
    S.schedule_date AS appointment_date,
    A.slot_number AS time_slot,
    A.status AS appointment_status,
    A.purpose,
    ST.first_name AS staff_first_name,
    ST.last_name AS staff_last_name,
    D.department_name,
    P.patient_id,
    P.first_name AS patient_first_name,
    P.last_name AS patient_last_name,
    COALESCE(SUM(T.treatment_cost), 0) AS total_cost
FROM appointment A
JOIN patient_secure_report P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff_secure_report ST ON S.staff_id = ST.staff_id
JOIN department D ON ST.department_id = D.department_id
LEFT JOIN treatment_record TR ON A.appointment_id = TR.appointment_id AND TR.status = 'F'
LEFT JOIN treatment T ON TR.treatment_id = T.treatment_id
WHERE A.status = 'F'
GROUP BY 
    A.appointment_id,
    S.schedule_date,
    A.slot_number,
    A.status,
    A.purpose,
    ST.first_name,
    ST.last_name,
    D.department_name,
    P.patient_id,
    P.first_name,
    P.last_name;


DROP TABLE IF EXISTS doctor_free_slot_report;
CREATE TABLE doctor_free_slot_report AS
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
FROM staff_secure_report ST
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
WHERE ST.job_type = 'D' AND S.schedule_date >= DATE(NOW()) 
GROUP BY ST.staff_id, ST.first_name, ST.last_name, S.schedule_date
ORDER BY S.schedule_date;


