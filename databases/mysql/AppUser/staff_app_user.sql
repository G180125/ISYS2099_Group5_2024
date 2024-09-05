-- Reset user
DROP USER IF EXISTS 'group5_staff_app_user'@'localhost';

-- Create app user
CREATE USER 'group5_staff_app_user'@'localhost' IDENTIFIED BY 'password';

-- Grant SOME privileges on TABLES to staff user
GRANT SELECT ON hospital_management.* TO 'group5_staff_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.ticket TO 'group5_staff_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.treatment_record TO 'group5_staff_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.appointment TO 'group5_staff_app_user'@'localhost';
GRANT UPDATE ON hospital_management.staff TO 'group5_staff_app_user'@'localhost';

-- Granting EXECUTE privilege on PROCEDURES to staff user
GRANT EXECUTE ON PROCEDURE hospital_management.search_patient_by_name TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.list_staff_by_department TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.list_staff_order_by_name TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.view_staff_schedule TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.add_patient_treatment TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.update_appointment TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.finish_appointment TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.view_patient_treatment TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_treatment_report TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_doctor_work_report TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_billing_report TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.create_ticket_for_update TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.update_ticket_for_update TO 'group5_staff_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.refresh_doctor_free_slot_report TO 'group5_staff_app_user'@'localhost';

-- Granting TRIGGER privilege on all relevant TABLES to staff user
GRANT TRIGGER ON hospital_management.user TO 'group5_staff_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.staff TO 'group5_staff_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.department TO 'group5_staff_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.appointment TO 'group5_staff_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.patient TO 'group5_staff_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.schedule TO 'group5_staff_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.treatment_record TO 'group5_staff_app_user'@'localhost';
GRANT TRIGGER ON hospital_management.ticket TO 'group5_staff_app_user'@'localhost';