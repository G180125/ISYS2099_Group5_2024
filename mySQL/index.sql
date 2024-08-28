-- PATIENT TABLE
ALTER TABLE patient ADD INDEX idx_patient_full_name (first_name, last_name); -- Index for faster search patient by name
ALTER TABLE patient ADD INDEX idx_patient_first_name (first_name);
ALTER TABLE patient ADD INDEX idx_patient_last_name (last_name);

-- STAFF TABLE
ALTER TABLE staff ADD INDEX idx_staff_department_job_type (department_id, job_type); -- Index for faster search staff by department, job_type 
ALTER TABLE staff ADD INDEX idx_staff_department (department_id); -- Index for faster search staff by department
ALTER TABLE staff ADD INDEX idx_staff_job_type (job_type); 
ALTER TABLE staff ADD INDEX idx_staff_manager (manager_id); -- Index for faster search staff by manager

-- SCHEDULE TABLE
ALTER TABLE schedule ADD INDEX idx_staff_id (staff_id); 

-- APPOINTMENT TABLE
ALTER TABLE appointment ADD INDEX idx_appointment_patient (patient_id);
ALTER TABLE appointment ADD INDEX idx_appointment_schedule (schedule_id); 

-- TREATMENT HISTORY TABLE

