-- Reset user
DROP USER IF EXISTS 'group5_admin_app_user'@'localhost';

-- Create app user
CREATE USER 'group5_admin_app_user'@'localhost' IDENTIFIED BY 'password';

-- Grant ALL privileges on TABLES to admin user
GRANT ALL PRIVILEGES ON hospital_management.* TO 'group5_admin_app_user'@'localhost';

-- Granting EXECUTE privilege on PROCEDURES to admin user
GRANT EXECUTE ON PROCEDURE hospital_management.add_new_staff TO 'group5_admin_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.update_staff TO 'group5_admin_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_treatment_report TO 'group5_admin_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_staff_job_change_report TO 'group5_admin_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_doctor_work_report TO 'group5_admin_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_billing_report TO 'group5_admin_app_user'@'localhost';

-- Granting TRIGGER privilege on all relevant TABLES to admin user
GRANT TRIGGER ON hospital_management.staff TO 'group5_admin_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.department TO 'group5_admin_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.ticket TO 'group5_admin_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.appointment TO 'group5_admin_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.patient TO 'group5_admin_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.schedule TO 'group5_admin_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.treatment_record TO 'group5_admin_app_user'@'localhost';