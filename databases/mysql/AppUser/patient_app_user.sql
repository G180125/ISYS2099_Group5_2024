-- Reset user
DROP USER IF EXISTS 'group5_patient_app_user'@'localhost';

-- Create app user
CREATE USER 'group5_patient_app_user'@'localhost' IDENTIFIED BY 'password';

-- Grant SOME privileges on tables to patient user
GRANT SELECT ON hospital_management.* TO 'group5_patient_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.patient TO 'group5_patient_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.appointment TO 'group5_patient_app_user'@'localhost';

-- Granting EXECUTE privilege on PROCEDURES to staff user
GRANT EXECUTE ON PROCEDURE hospital_management.register_patient TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.search_patient_by_name TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.list_staff_by_department TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.list_staff_order_by_name TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.view_staff_schedule TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.book_an_appointment TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.cancel_appointment TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_treatment_report TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_doctor_work_report TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_billing_report TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_patient_secure_report TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_doctor_free_slot_report TO 'group5_patient_app_user'@'localhost';

-- Granting TRIGGER privilege on all relevant TABLES to staff user
GRANT TRIGGER ON hospital_management.staff TO 'group5_patient_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.department TO 'group5_patient_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.appointment TO 'group5_patient_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.patient TO 'group5_patient_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.schedule TO 'group5_patient_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.treatment_record TO 'group5_patient_app_user'@'localhost';