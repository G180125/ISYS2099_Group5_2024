-- SET ROLE isys2099_group5_2024_app_role;
-- reset database
DROP DATABASE IF EXISTS hospital_management;

-- create database
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Access Token
CREATE TABLE IF NOT EXISTS access_token 
(
    access_token VARCHAR(255),
    CONSTRAINT access_token_pk PRIMARY KEY (access_token)
) ENGINE = InnoDB;

-- User table
CREATE TABLE IF NOT EXISTS user 
(
    user_id INT AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (user_id)
) ENGINE = InnoDB;

-- Patient table
CREATE TABLE IF NOT EXISTS patient 
(
    user_id       INT,
    date_of_birth DATE,
    allergies     TEXT,
    CONSTRAINT patient_pk PRIMARY KEY (user_id),
    CONSTRAINT patient_user_fk FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Department table
CREATE TABLE IF NOT EXISTS department
(
    department_id  INT AUTO_INCREMENT,
    department_name VARCHAR(100),
    manager_id     INT,
    CONSTRAINT department_pk PRIMARY KEY (department_id),
    CONSTRAINT manager_fk FOREIGN KEY (manager_id) REFERENCES user(user_id)
) ENGINE = InnoDB;

-- Staff table
CREATE TABLE IF NOT EXISTS staff
(   
    user_id        INT,
    job_type       ENUM('D', 'N', 'A'),  
    department_id  INT,
    salary         DECIMAL(10, 2),
    CONSTRAINT staff_pk PRIMARY KEY (user_id),
    CONSTRAINT staff_user_fk FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    CONSTRAINT staff_department_fk FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE,
    CONSTRAINT chk_staff_salary CHECK (salary > 0)
) ENGINE = InnoDB;

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule
(
    schedule_id     INT AUTO_INCREMENT,
    staff_id        INT,
    schedule_date   DATE NOT NULL,
    CONSTRAINT schedule_pk PRIMARY KEY (schedule_id),
    CONSTRAINT schedule_staff_fk FOREIGN KEY (staff_id) REFERENCES staff(user_id) ON DELETE CASCADE
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
    status         ENUM('C', 'U', 'F'),
    CONSTRAINT appointment_pk PRIMARY KEY (appointment_id),
    CONSTRAINT appointment_patient_fk FOREIGN KEY (patient_id) REFERENCES patient(user_id) ON DELETE CASCADE,
    CONSTRAINT appointment_schedule_fk FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Ticket table
CREATE TABLE IF NOT EXISTS ticket
(
    ticket_id      INT AUTO_INCREMENT,
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    gender         ENUM('M', 'F', 'O'), 
    job_type       ENUM('D', 'N', 'A'),   
    department_id  INT,
    salary         DECIMAL(10, 2),
    creator        INT NOT NULL,
    created_date   DATE NOT NULL,
    handled_by     INT,
    status         ENUM('P', 'A', 'R'),
    note           TEXT,
    CONSTRAINT ticket_pk PRIMARY KEY (ticket_id),
    CONSTRAINT ticket_creator_pk FOREIGN KEY (creator) REFERENCES staff(user_id) ON DELETE CASCADE,
    CONSTRAINT ticket_handled_by_pk FOREIGN KEY (handled_by) REFERENCES staff(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS treatment (
    treatment_id        INT AUTO_INCREMENT,
    treatment_name      VARCHAR(100),
    treatment_cost      DECIMAL(10,2),
    CONSTRAINT treatment_pk PRIMARY KEY (treatment_id)
) ENGINE = InnoDB;

-- Treatment Record table 
CREATE TABLE IF NOT EXISTS treatment_record (
    record_id           INT AUTO_INCREMENT,
    treatment_id        INT,
    treatment_date      DATE,
    appointment_id      INT,
    status              ENUM('M', 'F', 'U'),
    CONSTRAINT treatment_record_pk PRIMARY KEY (record_id),
    CONSTRAINT treatment_record_appointment_fk FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    CONSTRAINT treatment_record_treatment_fk FOREIGN KEY (treatment_id) REFERENCES treatment(treatment_id) ON DELETE CASCADE
) ENGINE = InnoDB;