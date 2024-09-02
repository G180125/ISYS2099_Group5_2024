DROP PROCEDURE IF EXISTS refresh_treatment_report;
CREATE PROCEDURE refresh_treatment_report()
BEGIN
    DELETE FROM treatment_report;
    INSERT INTO treatment_report
    SELECT  P.first_name AS patient_first_name, 
            P.last_name AS patient_last_name, 
            P.email AS patient_email,
            T.treatment_name, 
            T.treatment_date, 
            T.status AS treatment_status,
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
END;

DROP PROCEDURE IF EXISTS refresh_staff_job_change_report;
CREATE PROCEDURE refresh_staff_job_change_report()
BEGIN
    DELETE FROM staff_job_change_report;
    INSERT INTO staff_job_change_report
    SELECT 
        S.first_name AS staff_first_name, 
        S.last_name AS staff_last_name, 
        S.email AS staff_email, 
        S.gender AS staff_gender,
        S.salary AS staff_salary,
        S.job_type AS staff_job_type, 
        D1.department_name AS staff_department_name,
        M1.email AS staff_manager,
        T.created_date,
        T.note AS ticket_note,
        T.status AS ticket_status,
        T.first_name AS ticket_first_name,
        T.last_name AS ticket_last_name,
        T.gender AS ticket_gender,
        T.job_type AS ticket_job_type,
        D2.department_name AS ticket_department_name,
        M2.email AS ticket_manager
    FROM ticket T
    JOIN staff S ON T.creator = S.staff_id
    JOIN department D1 ON S.department_id = D1.department_id
    LEFT JOIN staff M1 ON S.manager_id = M1.staff_id
    LEFT JOIN department D2 ON T.department_id = D2.department_id
    LEFT JOIN staff M2 ON T.manager_id = M2.staff_id
    ORDER BY T.created_date;
END;

DROP PROCEDURE IF EXISTS refresh_doctor_work_report;
CREATE PROCEDURE refresh_doctor_work_report()
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
END;

DROP PROCEDURE IF EXISTS refresh_patient_secure_view;
CREATE PROCEDURE refresh_patient_secure_view()
BEGIN
    DELETE FROM patient_secure_view;
    INSERT INTO patient_secure_view
    SELECT 
        patient_id,
        first_name,
        last_name,
        email,
        access_token,
        date_of_birth,
        gender,
        allergies
    FROM 
        patient;
END;

DROP PROCEDURE IF EXISTS refresh_staff_secure_view;
CREATE PROCEDURE refresh_staff_secure_view()
BEGIN
    DELETE FROM staff_secure_view;
    INSERT INTO staff_secure_view
    SELECT 
        staff_id,
        first_name,
        last_name,
        email,
        access_token,
        gender,
        job_type,
        department_id,
        manager_id
    FROM 
        staff;
END;
