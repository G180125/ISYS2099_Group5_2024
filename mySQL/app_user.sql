CREATE DATABASE IF NOT EXISTS hospital_management;

CREATE USER 'isys2099_group5_2024_app_user'@'localhost' IDENTIFIED BY 'password';
CREATE ROLE isys2099_group5_2024_app_role;
GRANT ALL ON hospital_management.* TO isys2099_group5_2024_app_role;
GRANT isys2099_group5_2024_app_role TO 'isys2099_group5_2024_app_user'@'localhost';