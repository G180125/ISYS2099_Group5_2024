CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Patient table
CREATE TABLE IF NOT EXISTS patient
(
    patient_id     INT AUTO_INCREMENT,
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    date_of_birth  DATE,
    gender         ENUM('M', 'F', 'O'), -- (M)ale, (F)emale, (O)ther
    allergies      TEXT,
    CONSTRAINT patient_pk PRIMARY KEY (patient_id)
) ENGINE = InnoDB;

-- Staff table
CREATE TABLE IF NOT EXISTS staff
(
    staff_id       INT AUTO_INCREMENT,
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    job_type       ENUM('D', 'N', 'A'),   -- (D)octor, (N)urse, (A)dministrative personnel
    department_id  INT,
    salary         DECIMAL(10, 2),
    manager_id     INT,
    CONSTRAINT staff_pk PRIMARY KEY (staff_id),
    CONSTRAINT staff_department_fk FOREIGN KEY (department_id) REFERENCES department(department_id),
    CONSTRAINT staff_manager_fk FOREIGN KEY (manager_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

-- Department table
CREATE TABLE IF NOT EXISTS department
(
    department_id  INT AUTO_INCREMENT,
    department_name VARCHAR(100),
    CONSTRAINT department_pk PRIMARY KEY (department_id)
) ENGINE = InnoDB;

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule
(
    schedule_id INT AUTO_INCREMENT,
    staff_id      INT,
    schedule_date DATE,
    schedule_time TIME,
    title        TEXT,
    detail   TEXT,
    CONSTRAINT schedule_pk PRIMARY KEY (schedule_id),
    CONSTRAINT appointment_doctor_fk FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

-- Appointment table
CREATE TABLE IF NOT EXISTS appointment
(
    appointment_id INT AUTO_INCREMENT,
    patient_id     INT,
    doctor_id      INT,
    appointment_date DATE,
    appointment_time TIME,
    purpose        TEXT,
    notes_before   TEXT,
    notes_after    TEXT,
    CONSTRAINT appointment_pk PRIMARY KEY (appointment_id),
    CONSTRAINT appointment_patient_fk FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    CONSTRAINT appointment_doctor_fk FOREIGN KEY (doctor_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

-- Report table (for reporting purposes, this can include more fields based on the specific report)
CREATE TABLE IF NOT EXISTS report
(
    report_id      INT AUTO_INCREMENT,
    content        TEXT,
    created_date   DATE,
    CONSTRAINT report_pk PRIMARY KEY (report_id)
) ENGINE = InnoDB;

-- Treatment History table (relating patients and treatments over time)
CREATE TABLE IF NOT EXISTS treatment_history
(
    history_id     INT AUTO_INCREMENT,
    patient_id     INT,
    treatment      TEXT,
    treatment_date DATE,
    doctor_id      INT,
    CONSTRAINT treatment_history_pk PRIMARY KEY (history_id),
    CONSTRAINT treatment_history_patient_fk FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    CONSTRAINT treatment_history_doctor_fk FOREIGN KEY (doctor_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;
