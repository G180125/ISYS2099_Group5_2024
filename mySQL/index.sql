-- PATIENT TABLE
ALTER TABLE patient ADD INDEX idx_patient_name (first_name, last_name); -- Index for faster search patient by name

-- STAFF TABLE
ALTER TABLE staff ADD INDEX idx_staff_name (first_name, last_name); -- Index for faster search staff by name
ALTER TABLE staff ADD INDEX idx_staff_department (department_id); -- Index for faster search staff by department
ALTER TABLE staff ADD INDEX idx_staff_manager (manager_id); -- Index for faster search staff by manager

-- SCHEDULE TABLE
ALTER TABLE schedule ADD INDEX idx_schedule_staff (staff_id); -- Index for search schedule by staff
ALTER TABLE schedule ADD INDEX idx_schedule_date_time (schedule_date, schedule_time); -- Index for search schedule by date and time

-- APPOINTMENT TABLE
ALTER TABLE appointment ADD INDEX idx_appointment_patient (patient_id);
ALTER TABLE appointment ADD INDEX idx_appointment_doctor (doctor_id); 
ALTER TABLE appointment ADD INDEX idx_appointment_date_time (appointment_date, appointment_time); -- Index for search appointment by date and time

-- TREATMENT HISTORY TABLE
ALTER TABLE treatment_history ADD INDEX idx_treatment_patient (patient_id);
ALTER TABLE treatment_history ADD INDEX idx_treatment_history_patient_date (patient_id, treatment_date); -- Index for faster search by patient and treatment date

