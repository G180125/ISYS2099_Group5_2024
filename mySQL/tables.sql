-- SET ROLE isys2099_group5_2024_app_role;
-- reset database
DROP DATABASE IF EXISTS hospital_management;
DROP USER IF EXISTS 'group5_admin_app_user'@'localhost';
DROP USER IF EXISTS 'group5_staff_app_user'@'localhost';
DROP USER IF EXISTS 'group5_patient_app_user'@'localhost';

-- create database
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Patient table
CREATE TABLE IF NOT EXISTS patient 
(
    patient_id INT AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, 
    date_of_birth DATE,
    gender ENUM('M', 'F', 'O'),
    allergies TEXT,
    CONSTRAINT patient_pk PRIMARY KEY (patient_id)
) ENGINE = InnoDB;


-- Department table
CREATE TABLE IF NOT EXISTS department
(
    department_id  INT AUTO_INCREMENT,
    department_name VARCHAR(100),
    CONSTRAINT department_pk PRIMARY KEY (department_id)
) ENGINE = InnoDB;

-- Staff table
CREATE TABLE IF NOT EXISTS staff
(
    staff_id       INT AUTO_INCREMENT,
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    email          VARCHAR(100) UNIQUE NOT NULL,
    password       VARCHAR(100) NOT NULL, 
    refresh_token  VARCHAR(255),
    gender         ENUM('M', 'F', 'O'), 
    job_type       ENUM('D', 'N', 'A'),  
    department_id  INT,
    salary         DECIMAL(10, 2),
    manager_id     INT,
    CONSTRAINT staff_pk PRIMARY KEY (staff_id),
    CONSTRAINT staff_department_fk FOREIGN KEY (department_id) REFERENCES department(department_id),
    CONSTRAINT staff_manager_fk FOREIGN KEY (manager_id) REFERENCES staff(staff_id),
    CONSTRAINT chk_staff_salary CHECK (salary > 0)
) ENGINE = InnoDB;

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule
(
    schedule_id     INT AUTO_INCREMENT,
    staff_id        INT,
    schedule_date   DATE NOT NULL,
    time_slot       TINYINT, 
    CONSTRAINT schedule_pk PRIMARY KEY (schedule_id),
    CONSTRAINT schedule_staff_fk FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

-- Appointment table
CREATE TABLE IF NOT EXISTS appointment
(
    appointment_id INT AUTO_INCREMENT,
    patient_id     INT,
    schedule_id    INT,
    slot_number    INT NOT NULL,
    purpose        TEXT,
    notes_before   TEXT,
    notes_after    TEXT,
    status         ENUM('C', 'U', 'I', 'F'),
    CONSTRAINT appointment_pk PRIMARY KEY (appointment_id),
    CONSTRAINT appointment_patient_fk FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    CONSTRAINT appointment_schedule_fk FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS ticket
(
    ticket_id      INT,
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    gender         ENUM('M', 'F', 'O'), 
    job_type       ENUM('D', 'N', 'A'),   
    department_id  INT,
    salary         DECIMAL(10, 2),
    manager_id     INT,
    creator        INT NOT NULL,
    created_date   DATE NOT NULL,
    handled_by     INT NOT NULL,
    status         ENUM('P', 'A', 'R'),
    note           TEXT,
    CONSTRAINT ticket_pk PRIMARY KEY (ticket_id),
    CONSTRAINT ticket_creator_pk FOREIGN KEY (creator) REFERENCES staff(staff_id),
    CONSTRAINT ticket_handled_by_pk FOREIGN KEY (handled_by) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

-- Treatment History table 
CREATE TABLE IF NOT EXISTS treatment_history (
    history_id          INT AUTO_INCREMENT,
    treatment_name      VARCHAR(100),
    treatment_date      DATE,
    appointment_id      INT,
    doctor_id           INT, 
    CONSTRAINT treatment_history_pk PRIMARY KEY (history_id),
    CONSTRAINT treatment_history_patient_fk FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id),
    CONSTRAINT treatment_history_doctor_fk FOREIGN KEY (doctor_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;


