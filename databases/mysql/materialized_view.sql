DROP TABLE IF EXISTS patient_secure_view;
CREATE VIEW patient_secure_view AS
SELECT 
    U.user_id patient_id,
    U.first_name patient_first_name,
    U.last_name patient_last_name,
    U.email patient_email,
    P.date_of_birth patient_dob,
    U.gender patient_gender,
    P.allergies patient_allergies
FROM patient P
JOIN user U ON P.user_id = U.user_id;

DROP TABLE IF EXISTS staff_secure_view;
CREATE VIEW staff_secure_view AS
SELECT 
    U.user_id staff_id,
    U.first_name staff_first_name,
    U.last_name staff_last_name,
    U.email staff_email,
    U.gender staff_gender,
    S.job_type staff_job_type,
    D.department_id,
    D.department_name,
    S.manager_id,
    M.first_name manager_first_name,
    M.last_name manager_last_name,
    M.email manager_email
FROM staff S
JOIN user U ON S.user_id = U.user_id
JOIN department D ON S.department_id = D.department_id
LEFT JOIN user M ON S.manager_id = M.user_id;

DROP TABLE IF EXISTS treatment_report;
CREATE TABLE treatment_report AS
SELECT  P.patient_first_name, 
        P.patient_last_name, 
        P.patient_email,
        T.treatment_name, 
        T.treatment_date, 
        T.status treatment_status,
        ST.staff_first_name, 
        ST.staff_last_name, 
        ST.staff_job_type, 
        D.department_name
FROM treatment_record T
JOIN appointment A ON T.appointment_id = A.appointment_id
JOIN patient_secure_view P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff_secure_view ST ON S.staff_id = ST.staff_id
JOIN department D ON ST.department_id = D.department_id
ORDER BY T.status;

DROP TABLE IF EXISTS staff_job_change_report;
CREATE TABLE staff_job_change_report AS
SELECT 
    S.staff_first_name, 
    S.staff_last_name, 
    S.staff_email, 
    S.staff_gender,
    ST.salary as staff_salary,
    S.staff_job_type, 
    S.department_name AS staff_department_name,
    M1.staff_email AS staff_manager,
    T.created_date,
    T.note AS ticket_note,
    T.status AS ticket_status,
    T.first_name AS ticket_first_name,
    T.last_name AS ticket_last_name,
    T.gender AS ticket_gender,
    T.job_type AS ticket_job_type,
    D.department_name AS ticket_department_name,
    M2.staff_email AS ticket_manager
FROM ticket T
JOIN staff_secure_view S ON T.creator = S.staff_id
JOIN staff ST ON T.creator = ST.user_id
LEFT JOIN staff_secure_view M1 ON S.manager_id = M1.staff_id
LEFT JOIN department D ON T.department_id = D.department_id
LEFT JOIN staff_secure_view M2 ON T.manager_id = M2.staff_id
ORDER BY T.created_date;

DROP TABLE IF EXISTS doctor_work_report;
CREATE TABLE doctor_work_report AS
SELECT ST.staff_first_name, 
       ST.staff_last_name, 
       ST.staff_email,
       ST.staff_gender, 
       ST.staff_job_type, 
       S.schedule_date,
       A.slot_number time, 
       D.department_name,
       P.patient_first_name, 
       P.patient_last_name,
       A.status appointment_status
FROM appointment A
JOIN patient_secure_view P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff_secure_view ST ON S.staff_id = ST.staff_id
JOIN department D ON ST.department_id = D.department_id
ORDER BY S.schedule_date;

DROP TABLE IF EXISTS billing_report;
CREATE TABLE billing_report AS
SELECT A.appointment_id,
       S.schedule_date appointment_date,
       A.slot_number time,
       A.status appointment_status,
       A.purpose,
       A.notes_before,
       A.notes_after,
       ST.staff_first_name,
       ST.staff_last_name,
       D.department_name,
       P.patient_first_name,
       P.patient_last_name,
       GROUP_CONCAT(
        CONCAT(T.treatment_name, ' (', T.treatment_date, ')')
        ORDER BY T.treatment_date
        SEPARATOR ', '
      ) AS treatment_list
FROM appointment A
JOIN patient_secure_view P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff_secure_view ST ON S.staff_id = ST.staff_id
JOIN department D ON ST.department_id = D.department_id
LEFT JOIN treatment_record T ON A.appointment_id = T.appointment_id
GROUP BY 
    A.appointment_id, 
    S.schedule_date,
    A.slot_number, 
    A.status, 
    A.purpose,
    A.notes_before,
    A.notes_after,
    ST.staff_first_name,
    ST.staff_last_name,
    D.department_name,
    P.patient_first_name,
    P.patient_last_name;

