-- reset user
DROP USER IF EXISTS 'group5_admin_app_user'@'localhost';
DROP USER IF EXISTS 'group5_staff_app_user'@'localhost';
DROP USER IF EXISTS 'group5_patient_app_user'@'localhost';

-- ADMIN
-- all privileges
CREATE USER 'group5_admin_app_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON hospital_management.* TO 'group5_admin_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.add_new_staff TO 'group5_admin_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.update_staff TO 'group5_admin_app_user'@'localhost';

-- STAFF
-- select all tables
-- insert and update on staff 
-- update on appointment
CREATE USER 'group5_staff_app_user'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT ON hospital_management.* TO 'group5_staff_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.staff TO 'group5_staff_app_user'@'localhost';
GRANT UPDATE ON hospital_management.appointment TO 'group5_staff_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.ticket TO 'group5_staff_app_user'@'localhost';

-- PATIENT
-- select all tables
-- insert & update on patient
-- insert & update appointment
CREATE USER 'group5_patient_app_user'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT ON hospital_management.* TO 'group5_patient_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.patient TO 'group5_patient_app_user'@'localhost';
GRANT INSERT, UPDATE ON hospital_management.appointment TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.register_patient TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.search_patient_by_name TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.list_staff_by_department TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.list_staff_order_by_name TO 'group5_patient_app_user'@'localhost';
GRANT EXECUTE ON PROCEDURE hospital_management.view_staff_schedule TO 'group5_patient_app_user'@'localhost';



