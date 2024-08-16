-- PATIENT TABLE
ALTER TABLE patient ADD INDEX idx_patient_name (first_name, last_name); -- Index for faster search patient by name

-- STAFF TABLE
ALTER TABLE staff ADD INDEX idx_staff_name (first_name, last_name); -- Index for faster search staff by name
ALTER TABLE staff ADD INDEX idx_staff_department (department_id); -- Index for faster search staff by department
ALTER TABLE staff ADD INDEX idx_staff_manager (manager_id); -- Index for faster search staff by manager

-- APPOINTMENT TABLE
ALTER TABLE appointment ADD INDEX idx_appointment_patient (patient_id);
ALTER TABLE appointment ADD INDEX idx_appointment_schedule (schedule_id); 

-- TREATMENT HISTORY TABLE

