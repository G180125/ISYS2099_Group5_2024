CREATE OR REPLACE FUNCTION refresh_treatment_report()
RETURNS TRIGGER AS 
BEGIN
    DELETE FROM treatment_report;
    INSERT INTO treatment_report
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

    RETURN NULL;
END;

CREATE OR REPLACE FUNCTION refresh_staff_job_change_report()
RETURNS TRIGGER AS 
BEGIN
    DELETE FROM staff_job_change_report;
    INSERT INTO staff_job_change_report
    SELECT  S.first_name AS staff_first_name, 
            S.last_name AS staff_last_name, 
            S.email AS staff_email, 
            S.gender,
            S.salary,
            S.job_type, 
            D.department_name,
            M.first_name AS manager_first_name, 
            M.last_name AS manager_last_name, 
            M.email AS manager_email,
            T.created_date,
            T.note AS ticket_note,
            H.email AS approved_by 
    FROM staff S
    JOIN department D ON S.department_id = D.department_id
    JOIN staff M ON S.manager_id = M.staff_id
    JOIN ticket T ON T.creator = S.staff_id
    JOIN staff H ON T.handled_by = H.staff_id
    WHERE T.status = 'A' 
    ORDER BY T.created_date;

    RETURN  NULL;
END;

CREATE OR REPLACE FUNCTION refresh_doctor_work_report()
RETURNS TRIGGER AS 
BEGIN
    DELETE FROM doctor_work_report;

    INSERT INTO doctor_work_report
    SELECT ST.first_name AS staff_first_name, 
           ST.last_name AS staff_last_name, 
           ST.email AS staff_email,
           ST.gender AS staff_gender, 
           ST.job_type, 
           S.schedule_date,
           A.slot_number AS time, 
           D.department_name,
           P.first_name AS patient_first_name, 
           P.last_name AS patient_last_name,
           A.status AS appointment_status
    FROM appointment A
    JOIN patient P ON A.patient_id = P.patient_id
    JOIN schedule S ON A.schedule_id = S.schedule_id
    JOIN staff ST ON S.staff_id = ST.staff_id
    JOIN department D ON ST.department_id = D.department_id
    ORDER BY S.schedule_date;

    RETURN NULL;
END;


CREATE OR REPLACE FUNCTION refresh_billing_report()
RETURNS TRIGGER AS 
BEGIN
    DELETE FROM billing_report;
    INSERT INTO billing_report
    SELECT A.appointment_id,
           S.schedule_date AS appointment_date,
           A.slot_number AS time,
           A.status AS appointment_status,
           A.purpose,
           A.notes_before,
           A.notes_after,
           ST.first_name AS staff_first_name,
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

    RETURN NULL;
END;