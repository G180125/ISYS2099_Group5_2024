DROP TABLE IF EXISTS treatment_report;
CREATE TABLE treatment_report AS
SELECT  P.first_name AS patient_first_name, 
        P.last_name AS patient_last_name, 
        T.treatment_name, 
        T.treatment_date, 
        T.status treatment_status,
        ST.first_name AS staff_first_name, 
        ST.last_name AS staff_last_name, 
        ST.job_type, 
        D.department_name
FROM treatment_record T
JOIN appointment A ON T.appointment_id = A.appointment_id
JOIN patient P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff ST ON S.staff_id = ST.staff_id
JOIN department D ON ST.department_id = D.department_id
ORDER BY T.status;

DROP TABLE IF EXISTS staff_job_change_report;
CREATE TABLE staff_job_change_report AS
SELECT  S.first_name staff_first_name, 
        S.last_name staff_last_name, 
        S.email staff_email, 
        S.gender,
        S.salary,
        S.job_type, 
        D.department_name,
        M.first_name manager_first_name, 
        M.last_name manager_last_name, 
        M.email manager_email,
        T.created_date,
        T.note ticket_note,
        H.email approved_by 
FROM staff S
JOIN department D ON S.department_id = D.department_id
JOIN staff M ON S.manager_id = M.staff_id
JOIN ticket T ON T.creator = S.staff_id
JOIN staff H ON T.handled_by = H.staff_id
WHERE T.status = 'A' 
ORDER BY T.created_date;

DROP TABLE IF EXISTS doctor_work_report;
CREATE TABLE doctor_work_report AS
SELECT ST.first_name staff_first_name, 
       ST.last_name staff_last_name, 
       ST.gender staff_gender, 
       ST.job_type, 
       S.schedule_date,
       A.slot_number time, 
       D.department_name,
       P.first_name patient_first_name, 
       P.last_name patient_last_name,
       A.status appointment_status
FROM appointment A
JOIN patient P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff ST ON S.staff_id = ST.staff_id
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
       ST.first_name staff_first_name,
       ST.last_name AS staff_last_name,
       D.department_name,
       P.first_name AS patient_first_name,
       P.last_name AS patient_last_name,
       GROUP_CONCAT(
        CONCAT(T.treatment_name, ' (', T.treatment_date, ')')
        ORDER BY T.treatment_date
        SEPARATOR ', '
      ) AS treatment_list
FROM appointment A
JOIN patient P ON A.patient_id = P.patient_id
JOIN schedule S ON A.schedule_id = S.schedule_id
JOIN staff ST ON S.staff_id = ST.staff_id
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
    ST.first_name, 
    ST.last_name, 
    D.department_name,
    P.first_name, 
    P.last_name;

