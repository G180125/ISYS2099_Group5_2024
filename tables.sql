SET ROLE isys2099_group5_2024_app_role;

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
    gender         ENUM('M', 'F', 'O'), -- (M)ale, (F)emale, (O)ther
    job_type       ENUM('D', 'N', 'A'),   -- (D)octor, (N)urse, (A)dministrative personnel
    department_id  INT,
    salary         DECIMAL(10, 2),
    manager_id     INT,
    CONSTRAINT staff_pk PRIMARY KEY (staff_id),
    CONSTRAINT staff_department_fk FOREIGN KEY (department_id) REFERENCES department(department_id),
    CONSTRAINT staff_manager_fk FOREIGN KEY (manager_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule
(
    schedule_id INT AUTO_INCREMENT,
    staff_id      INT,
    schedule_date DATE,
    CONSTRAINT schedule_pk PRIMARY KEY (schedule_id),
    CONSTRAINT schedule_staff_fk FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

-- Appointment table
CREATE TABLE IF NOT EXISTS appointment
(
    appointment_id INT AUTO_INCREMENT,
    patient_id     INT,
    schedule_id    INT,
    start_time     TIME,
    end_time       TIME,
    purpose        TEXT,
    notes_before   TEXT,
    notes_after    TEXT,
    CONSTRAINT appointment_pk PRIMARY KEY (appointment_id),
    CONSTRAINT appointment_patient_fk FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    CONSTRAINT appointment_schedule_fk FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id)
) ENGINE = InnoDB;

-- Treatment History table 
CREATE TABLE IF NOT EXISTS treatment_history
(
    history_id     INT AUTO_INCREMENT,
    treatment_name   VARCHAR(100),
    patient_id     INT,
    treatment_date DATE,
    doctor_id      INT,
    CONSTRAINT treatment_history_pk PRIMARY KEY (history_id),
    CONSTRAINT treatment_history_patient_fk FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    CONSTRAINT treatment_history_doctor_fk FOREIGN KEY (doctor_id) REFERENCES staff(staff_id)
) ENGINE = InnoDB;

