-- USER TABLE
ALTER TABLE user ADD INDEX idx_user_full_name (first_name, last_name); -- Index for faster search patient by name
ALTER TABLE user ADD INDEX idx_user_first_name (first_name);
ALTER TABLE user ADD INDEX idx_user_last_name (last_name);
ALTER TABLE user ADD INDEX idx_user_email (email);

-- PATIENT TABLE

-- STAFF TABLE
-- ALTER TABLE staff ADD INDEX idx_staff_department_job_type (department_id, job_type); -- Index for faster search staff by department, job_type 
ALTER TABLE staff ADD INDEX idx_staff_department (department_id); -- Index for faster search staff by department
ALTER TABLE staff ADD INDEX idx_staff_job_type (job_type); 

-- SCHEDULE TABLE
ALTER TABLE schedule ADD INDEX idx_schedule_id (staff_id); 
ALTER TABLE schedule ADD INDEX idx_schedule_date (schedule_date);

-- APPOINTMENT TABLE
ALTER TABLE appointment ADD INDEX idx_appointment_patient (patient_id);
ALTER TABLE appointment ADD INDEX idx_appointment_schedule (schedule_id); 
ALTER TABLE appointment ADD INDEX idx_appointment_status (status);
ALTER TABLE appointment ADD INDEX idx_appointment_slot_number (slot_number);

-- DOCTOR FREE SLOT REPORT
ALTER TABLE doctor_free_slot_report ADD INDEX idx_doctor_free_slot_report_schedule_date (schedule_date);
ALTER TABLE doctor_free_slot_report ADD INDEX idx_doctor_free_slot_report_staff_id (staff_id);

-- PATIENT SECURE REPORT
ALTER TABLE patient_secure_report ADD INDEX idx_patient_secure_report_patient_id (patient_id);

-- STAFF SECURE REPORT
ALTER TABLE staff_secure_report ADD INDEX idx_staff_secure_report_staff_id (staff_id);
ALTER TABLE staff_secure_report ADD INDEX idx_staff_secure_report_department_id (department_id);
ALTER TABLE staff_secure_report ADD INDEX idx_staff_secure_report_job_type (job_type);
ALTER TABLE staff_secure_report ADD INDEX idx_staff_secure_report_full_name (first_name, last_name);
ALTER TABLE staff_secure_report ADD INDEX idx_staff_secure_report_first_name (first_name);
ALTER TABLE staff_secure_report ADD INDEX idx_staff_secure_report_last_name (last_name);

-- TICKET
ALTER TABLE ticket ADD INDEX idx_ticket_creator (creator);
ALTER TABLE ticket ADD INDEX idx_ticket_status (status);

-- TREATMENT RECORD
ALTER TABLE treatment_record ADD INDEX idx_treatment_record_appointment_id (appointment_id);
ALTER TABLE treatment_record ADD INDEX idx_treatment_record_status (status);

-- TREATMENT REPORT
ALTER TABLE treatment_report ADD INDEX idx_treatment_report_patient_id (patient_id);
ALTER TABLE treatment_report ADD INDEX idx_treatment_report_treatment_id (record_id);
ALTER TABLE treatment_report ADD INDEX idx_treatment_report_appointment_id (appointment_id);
ALTER TABLE treatment_report ADD INDEX idx_treatment_report_patient_email (patient_email); 
ALTER TABLE treatment_report ADD INDEX idx_treatment_report_treatment_date (treatment_date);

-- DOCTOR WORK REPORT
ALTER TABLE doctor_work_report ADD INDEX idx_doctor_work_report_schedule_date (schedule_date);
ALTER TABLE doctor_work_report ADD INDEX idx_doctor_work_report_email (email);

-- STAFF JOB CHANGE REPORT
ALTER TABLE staff_job_change_report ADD INDEX idx_staff_job_change_report_staff_id (staff_id);
ALTER TABLE staff_job_change_report ADD INDEX idx_staff_job_change_report_created_date (created_date);
ALTER TABLE staff_job_change_report ADD INDEX idx_staff_job_change_report_email (staff_email);


