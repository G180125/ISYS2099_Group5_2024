CREATE DATABASE IF NOT EXISTS hospital_management;

-- ADMIN
-- all privileges
CREATE USER 'isys2099_group5_2024_admin_app_user'@'localhost' IDENTIFIED BY 'password';
CREATE ROLE isys2099_group5_2024_admin_app_role;
GRANT ALL PRIVILEGES ON hospital_management.* TO isys2099_group5_2024_admin_app_role;
GRANT isys2099_group5_2024_admin_app_role TO 'isys2099_group5_2024_admin_app_user'@'localhost';

-- STAFF
-- select all tables
-- insert and update on staff 
-- update on appointment
CREATE USER 'isys2099_group5_2024_staff_app_user'@'localhost' IDENTIFIED BY 'password';
CREATE ROLE isys2099_group5_2024_staff_app_role;
GRANT SELECT ON hospital_management.* TO isys2099_group5_2024_staff_app_role;
GRANT INSERT, UPDATE ON hospital_management.staff TO isys2099_group5_2024_staff_app_role;
GRANT UPDATE ON hospital_management.appointment TO isys2099_group5_2024_staff_app_role;
GRANT isys2099_group5_2024_staff_app_role TO 'isys2099_group5_2024_staff_app_user'@'localhost';

-- PATIENT
-- select all tables
-- insert & update on patient
-- insert & update appointment
CREATE USER 'isys2099_group5_2024_patient_app_user'@'localhost' IDENTIFIED BY 'password';
CREATE ROLE isys2099_group5_2024_patient_app_role;
GRANT SELECT ON hospital_management.* TO isys2099_group5_2024_patient_app_role;
GRANT INSERT, UPDATE ON hospital_management.appointment TO isys2099_group5_2024_patient_app_role;
GRANT INSERT, UPDATE ON hospital_management.appointment TO isys2099_group5_2024_patient_app_role;
GRANT isys2099_group5_2024_patient_app_role TO 'isys2099_group5_2024_patient_app_user'@'localhost';


