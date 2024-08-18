INSERT INTO patient (patient_id, first_name, last_name, email, password, date_of_birth, gender, allergies) 
VALUES 
    (1, 'Paul', 'Buck', 'paul@gmail.com', '$2b$10$lcpFllUbtVi2s9ko00mBoOBQ3d9JgvffGDTw2AMGXb2kOwHT7Y19e','2010-05-20', 'M', 'Grass'),
    (2, 'Claire', 'Hartman', 'claire@gmail.com', '$2b$10$C2yOCLt.Phow5msDkfdp9.CkyOJaU64uaa0t7SSNHzlYVZjGIzcqi','1976-03-17', 'F', ''),
    (3, 'Manuel', 'Leon', 'manuel@gmail.com', '$2b$10$C2yOCLt.Phow5msDkfdp9.CkyOJaU64uaa0t7SSNHzlYVZjGIzcqi','1960-09-28', 'F', ''),
    (4, 'Sophia', 'Beasley', 'sophia@gmail.com', '$2b$10$6i6sQk17e1/hi5urchKeJOpb8zrhQhlU2x0/LVzWrDXNlDjrnfjOq','1956-03-14', 'F', ''),
    (5, 'Rhonda', 'Sanchez', 'rhonda@gmail.com', '$2b$10$0W4VxLt8/61N8ZDglbj9y.PgR.0dnkETcbXEPUIEU9zdTY6k9Lcni','1981-09-12', 'M', ''),
    (6, 'Jennifer', 'Thomas', 'jennifer@gmail.com', '$2b$10$BeRFj2h0yfBC/WcYd0InleBqzmyw109dHreSAWKWnOzOrb7n8P/e2', '1988-11-12', 'M', ''),
    (7, 'Sherri', 'Austin', 'sherri@gmail.com', '$2b$10$BeRFj2h0yfBC/WcYd0InleBqzmyw109dHreSAWKWnOzOrb7n8P/e2', '1980-08-12', 'F', ''),
    (8, 'Brian', 'Webster', 'brian@gmail.com', '$2b$10$nmzLNWhI.8lGAN6KnKFHF.v.RuxvfOlEiH52AHTGuo1yh5KGQnq5q', '1982-04-24', 'F', 'Peanut'),
    (9, 'Caroline', 'Rocha', 'caroline@gmail.com', '$2b$10$y2pYL32ozTxQzlxT77sT7eHVs12YV9DV4lfGCj5XemMygo9mC61sm', '1989-03-17', 'F', ''),
    (10, 'Annette', 'Wu', 'annette@gmail.com', '$2b$10$y2pYL32ozTxQzlxT77sT7eHVs12YV9DV4lfGCj5XemMygo9mC61sm','1975-11-02', 'F', ''),
    (11, 'Sarah', 'Coleman', 'sarah@gmail.com', '$2b$10$R.Mae5ByfuYYUu44PGsHhOl8pa6f5m9cBHDtYDy5fOZ.T950hVWOK', '1997-08-16', 'F', ''),
    (12, 'Alan', 'King', 'alan@gmail.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2', '1989-09-19', 'M', ''),
    (13, 'Jessica', 'Camacho', 'jessica@gmail.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2','1969-09-12', 'F', ''),
    (14, 'Kathy', 'Grant', 'kathy@gmail.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2', '1989-02-04', 'M', ''),
    (15, 'Janet', 'Sanchez', 'janet@gmail.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2', '1971-07-29', 'F', ''),
    (16, 'Jesse', 'Wang', 'jesse@gmail.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2','1999-12-31', 'M', ''),
    (17, 'Elijah', 'Calhoun', 'elijah@gmail.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2', '1988-06-29', 'F', ''),
    (18, 'Michael', 'Sawyer', 'michael@gmail.com', '$2b$10$FaCko4NmpkTQlS8b3W6BKuPpuBid8W4UOadstq/yhIm3vgI8lnaaq', '1995-12-04', 'M', ''),
    (19, 'Angela', 'Matthews', 'angela@gmail.com', '$2b$10$uA7YnBvu8bgPp9.tFCCnyen6N9vVEpGeH9fTJ6Xl3voHTlLSt8YPW','1997-02-07', 'M', ''),
    (20, 'Jessica', 'Hernandez', 'jessicaH@gmail.com', '$2b$10$gm6Cl/BOd.U.YhxPvYbUU.CSoDFAzov83otL6nuB6ZvLKstJxsTdO','2003-01-30', 'M', '');

INSERT INTO department (department_id, department_name) 
VALUES 
    (1, 'Pediatrician'),
    (2, 'Cardiologist'),
    (3, 'Orthopedic Surgeon'),
    (4, 'Ophthalmologist');

INSERT INTO staff (staff_id, first_name, last_name, email, password, gender, job_type, department_id, salary, manager_id) 
VALUES
    (1, 'Eve', 'Williams', 'eve.williams@hospital.management.com', '$2b$10$lcpFllUbtVi2s9ko00mBoOBQ3d9JgvffGDTw2AMGXb2kOwHT7Y19e', 'F', 'A', NULL, 80900, NULL),
    (2, 'Eve', 'Brown', 'eve.brown@hospital.management.com', '$2b$10$C2yOCLt.Phow5msDkfdp9.CkyOJaU64uaa0t7SSNHzlYVZjGIzcqi', 'M', 'D', 1, 166600, 1),
    (3, 'Eve', 'Wilson', 'eve.wilson@hospital.management.com', '$2b$10$C2yOCLt.Phow5msDkfdp9.CkyOJaU64uaa0t7SSNHzlYVZjGIzcqi', 'F', 'D', 1, 162600, 2),
    (4, 'Charlie', 'Moore', 'charlie.moore@hospital.management.com', '$2b$10$6i6sQk17e1/hi5urchKeJOpb8zrhQhlU2x0/LVzWrDXNlDjrnfjOq', 'M', 'D', 1, 127600, 2),
    (5, 'John', 'Brown', 'john.brown@hospital.management.com', '$2b$10$0W4VxLt8/61N8ZDglbj9y.PgR.0dnkETcbXEPUIEU9zdTY6k9Lcni', 'F', 'D', 1, 120300, 2),
    (7, 'Frank', 'Johnson', 'frank.johnson@hospital.management.com', '$2b$10$BeRFj2h0yfBC/WcYd0InleBqzmyw109dHreSAWKWnOzOrb7n8P/e2', 'F', 'N', 1, 58600, 2),
    (8, 'Charlie', 'Williams', 'charlie.williams@hospital.management.com', '$2b$10$BeRFj2h0yfBC/WcYd0InleBqzmyw109dHreSAWKWnOzOrb7n8P/e2', 'M', 'N', 1, 58000, 2),
    (9, 'Alice', 'Smith', 'alice.smith@hospital.management.com', '$2b$10$nmzLNWhI.8lGAN6KnKFHF.v.RuxvfOlEiH52AHTGuo1yh5KGQnq5q', 'F', 'N', 1, 47700, 2),
    (10, 'Grace', 'Smith', 'grace.smith@hospital.management.com', '$2b$10$nmzLNWhI.8lGAN6KnKFHF.v.RuxvfOlEiH52AHTGuo1yh5KGQnq5q', 'M', 'N', 1, 52500, 2),
    (12, 'Diana', 'Williams', 'diana.williams@hospital.management.com', '$2b$10$y2pYL32ozTxQzlxT77sT7eHVs12YV9DV4lfGCj5XemMygo9mC61sm', 'M', 'D', 2, 183300, 1),
    (13, 'Diana', 'Jones', 'diana.jones@hospital.management.com', '$2b$10$y2pYL32ozTxQzlxT77sT7eHVs12YV9DV4lfGCj5XemMygo9mC61sm', 'F', 'D', 2, 128300, 12),
    (14, 'Hank', 'Smith', 'hank.smith@hospital.management.com', '$2b$10$y2pYL32ozTxQzlxT77sT7eHVs12YV9DV4lfGCj5XemMygo9mC61sm', 'M', 'D', 2, 101400, 12),
    (15, 'Diana', 'Jones', 'diana.jones2@hospital.management.com', '$2b$10$R.Mae5ByfuYYUu44PGsHhOl8pa6f5m9cBHDtYDy5fOZ.T950hVWOK', 'F', 'D', 2, 131900, 12),
    (17, 'Grace', 'Wilson', 'grace.wilson@hospital.management.com', '$2b$10$R.Mae5ByfuYYUu44PGsHhOl8pa6f5m9cBHDtYDy5fOZ.T950hVWOK', 'F', 'N', 2, 64800, 12),
    (18, 'Charlie', 'Wilson', 'charlie.wilson@hospital.management.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2', 'F', 'N', 2, 52600, 12),
    (19, 'Diana', 'Davis', 'diana.davis@hospital.management.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2', 'F', 'N', 2, 40600, 12),
    (20, 'Charlie', 'Moore', 'charlie.moore2@hospital.management.com', '$2b$10$gm6Cl/BOd.U.YhxPvYbUU.CSoDFAzov83otL6nuB6ZvLKstJxsTdO', 'M', 'N', 2, 77700, 12),
    (22, 'Grace', 'Taylor', 'grace.taylor@hospital.management.com', '$2b$10$gm6Cl/BOd.U.YhxPvYbUU.CSoDFAzov83otL6nuB6ZvLKstJxsTdO', 'F', 'D', 3, 182600, 1),
    (23, 'Alice', 'Brown', 'alice.brown@hospital.management.com', '$2b$10$lcpFllUbtVi2s9ko00mBoOBQ3d9JgvffGDTw2AMGXb2kOwHT7Y19e', 'M', 'D', 3, 152200, 22),
    (24, 'John', 'Moore', 'john.moore@hospital.management.com', '$2b$10$lcpFllUbtVi2s9ko00mBoOBQ3d9JgvffGDTw2AMGXb2kOwHT7Y19e', 'F', 'D', 3, 187000, 22),
    (25, 'Eve', 'Taylor', 'eve.taylor@hospital.management.com', '$2b$10$C2yOCLt.Phow5msDkfdp9.CkyOJaU64uaa0t7SSNHzlYVZjGIzcqi', 'M', 'D', 3, 140200, 22),
    (27, 'Frank', 'Jones', 'frank.jones@hospital.management.com', '$2b$10$6i6sQk17e1/hi5urchKeJOpb8zrhQhlU2x0/LVzWrDXNlDjrnfjOq', 'M', 'N', 3, 59600, 22),
    (28, 'Frank', 'Davis', 'frank.davis@hospital.management.com', '$2b$10$6i6sQk17e1/hi5urchKeJOpb8zrhQhlU2x0/LVzWrDXNlDjrnfjOq', 'F', 'N', 3, 55100, 22),
    (29, 'Grace', 'Smith', 'grace.smith2@hospital.management.com', '$2b$10$0W4VxLt8/61N8ZDglbj9y.PgR.0dnkETcbXEPUIEU9zdTY6k9Lcni', 'F', 'N', 3, 78900, 22),
    (30, 'Jane', 'Johnson', 'jane.johnson@hospital.management.com', '$2b$10$0W4VxLt8/61N8ZDglbj9y.PgR.0dnkETcbXEPUIEU9zdTY6k9Lcni', 'M', 'N', 3, 47200, 22),
    (32, 'Alice', 'Williams', 'alice.williams@hospital.management.com', '$2b$10$BeRFj2h0yfBC/WcYd0InleBqzmyw109dHreSAWKWnOzOrb7n8P/e2', 'F', 'D', 4, 182200, 1),
    (33, 'Frank', 'Johnson', 'frank.johnson2@hospital.management.com', '$2b$10$nmzLNWhI.8lGAN6KnKFHF.v.RuxvfOlEiH52AHTGuo1yh5KGQnq5q', 'M', 'D', 4, 174400, 32),
    (34, 'Grace', 'Johnson', 'grace.johnson@hospital.management.com', '$2b$10$nmzLNWhI.8lGAN6KnKFHF.v.RuxvfOlEiH52AHTGuo1yh5KGQnq5q', 'F', 'D', 4, 151700, 32),
    (35, 'Diana', 'Johnson', 'diana.johnson@hospital.management.com', '$2b$10$R.Mae5ByfuYYUu44PGsHhOl8pa6f5m9cBHDtYDy5fOZ.T950hVWOK', 'M', 'D', 4, 173300, 32),
    (37, 'Eve', 'Smith', 'eve.smith@hospital.management.com', '$2b$10$ZAwvoJ1pVl0tlEtsbq41..PoPW5K1VzfLPciq8eoRiCzhuZ.FD1q2', 'F', 'N', 4, 47200, 32),
    (38, 'Jane', 'Wilson', 'jane.wilson@hospital.management.com', '$2b$10$gm6Cl/BOd.U.YhxPvYbUU.CSoDFAzov83otL6nuB6ZvLKstJxsTdO', 'M', 'N', 4, 66500, 32),
    (39, 'John', 'Wilson', 'john.wilson@hospital.management.com', '$2b$10$FaCko4NmpkTQlS8b3W6BKuPpuBid8W4UOadstq/yhIm3vgI8lnaaq', 'F', 'N', 4, 55000, 32),
    (40, 'Bob', 'Smith', 'bob.smith@hospital.management.com', '$2b$10$uA7YnBvu8bgPp9.tFCCnyen6N9vVEpGeH9fTJ6Xl3voHTlLSt8YPW', 'F', 'N', 4, 41600, 32);

INSERT INTO schedule (schedule_id, staff_id, schedule_date) 
VALUES
    -- admin
    (1, 1, '2024-09-12'),
    (2, 1, '2024-09-13'),
    (3, 1, '2024-09-14'),
    (4, 1, '2024-09-15'),
    (5, 1, '2024-09-16'),
    -- department 1 doctor
    (6, 2, '2024-09-12'),
    (7, 4, '2024-09-13'),
    (8, 2, '2024-09-14'),
    (9, 4, '2024-09-15'),
    (10, 2, '2024-09-16'),
    (11, 3, '2024-09-12'),
    (12, 5, '2024-09-13'),
    (13, 3, '2024-09-14'),
    (14, 4, '2024-09-15'),
    (15, 5, '2024-09-16'),
    -- department 1 nurse
    (16, 7, '2024-09-12'),
    (17, 9, '2024-09-13'),
    (18, 7, '2024-09-14'),
    (19, 9, '2024-09-15'),
    (20, 7, '2024-09-16'),
    (21, 8, '2024-09-12'),
    (22, 10, '2024-09-13'),
    (23, 8, '2024-09-14'),
    (24, 10, '2024-09-15'),
    (25, 10, '2024-09-16'),
    -- department 2 doctor
    (26, 12, '2024-09-12'),
    (27, 14, '2024-09-13'),
    (28, 12, '2024-09-14'),
    (29, 14, '2024-09-15'),
    (30, 12, '2024-09-16'),
    (31, 13, '2024-09-12'),
    (32, 15, '2024-09-13'),
    (33, 13, '2024-09-14'),
    (34, 14, '2024-09-15'),
    (35, 15, '2024-09-16'),
    -- department 2 nurse
    (36, 17, '2024-09-12'),
    (37, 19, '2024-09-13'),
    (38, 17, '2024-09-14'),
    (39, 19, '2024-09-15'),
    (40, 17, '2024-09-16'),
    (41, 18, '2024-09-12'),
    (42, 20, '2024-09-13'),
    (43, 18, '2024-09-14'),
    (44, 20, '2024-09-15'),
    (45, 19, '2024-09-16'),
    -- department 3 doctor
    (46, 22, '2024-09-12'),
    (47, 24, '2024-09-13'),
    (48, 22, '2024-09-14'),
    (49, 24, '2024-09-15'),
    (50, 22, '2024-09-16'),
    (51, 23, '2024-09-12'),
    (52, 25, '2024-09-13'),
    (53, 23, '2024-09-14'),
    (54, 24, '2024-09-15'),
    (55, 25, '2024-09-16'),
    -- department 3 nurse
    (56, 27, '2024-09-12'),
    (57, 29, '2024-09-13'),
    (58, 27, '2024-09-14'),
    (59, 29, '2024-09-15'),
    (60, 27, '2024-09-16'),
    (61, 28, '2024-09-12'),
    (62, 30, '2024-09-13'),
    (63, 28, '2024-09-14'),
    (64, 30, '2024-09-15'),
    (65, 28, '2024-09-16'),
    -- department 4 doctor
    (66, 32, '2024-09-12'),
    (67, 34, '2024-09-13'),
    (68, 32, '2024-09-14'),
    (69, 34, '2024-09-15'),
    (70, 32, '2024-09-16'),
    (71, 33, '2024-09-12'),
    (72, 35, '2024-09-13'),
    (73, 33, '2024-09-14'),
    (74, 34, '2024-09-15'),
    (75, 35, '2024-09-16'),
    -- department 4 nurse
    (76, 37, '2024-09-12'),
    (77, 39, '2024-09-13'),
    (78, 37, '2024-09-14'),
    (79, 39, '2024-09-15'),
    (80, 37, '2024-09-16'),
    (81, 38, '2024-09-12'),
    (82, 40, '2024-09-13'),
    (83, 38, '2024-09-14'),
    (84, 40, '2024-09-15'),
    (85, 38, '2024-09-16');

/*
INSERT INTO treatment_history (history_id, treatment_name, patient_id, treatment_date, doctor_id) 
VALUES
    (1, 'X-ray', 6, '2024-09-02', 12),
    (2, 'Endoscopy', 3, '2024-09-04', 24),
    (3, 'Colonoscopy', 15, '2024-09-05', 5),
    (4, 'X-ray', 12, '2024-09-07', 33),
    (5, 'X-ray', 8, '2024-09-10', 14),
    (6, 'Allergy Test', 14, '2024-09-03', 5),
    (7, 'CT Scan', 2, '2024-09-07', 4),
    (8, 'Ultrasound', 7, '2024-09-09', 12),
    (9, 'Mammography', 7, '2024-09-02', 22),
    (10, 'Colonoscopy', 3, '2024-09-04', 33),
    (11,'Colonoscopy', 1, '2024-09-01', 5),
    (12, 'MRI Scan', 5, '2024-09-01', 15),
    (13, 'Blood Test', 13, '2024-09-06', 35),
    (14, 'Endoscopy', 6, '2024-09-10', 2),
    (15, 'Allergy Test', 12, '2024-09-04', 3),
    (16, 'CT Scan', 4, '2024-09-07', 21),
    (17, 'MRI Scan', 12, '2024-09-01', 23),
    (18, 'CT Scan', 6, '2024-09-06', 34),
    (19, 'MRI Scan', 15, '2024-09-08', 35),
    (20, 'Allergy Test', 9, '2024-09-08', 2);
*/

/*
    slot number:
    9-10: 1
    10-11: 2
    11-12: 3
    12-13: 4
    13-14: 5
    14-15: 6
    15-16: 7
    16-17: 8
*/
INSERT INTO appointment (appointment_id, patient_id, schedule_id, slot_number, purpose, status) VALUES
    (1, 1, 66, 1, 'Routine Check-up', 'U'),
    (2, 2, 70, 2, 'Specialist Referral', 'U'),
    (3, 3, 51, 4, 'Follow-up', 'U'),
    (4, 4, 54, 7, 'Routine Check-up', 'U'),
    (5, 5, 66, 8, 'Specialist Referral', 'U'),
    (6, 6, 34, 1, 'Follow-up', 'U'),
    (7, 7, 70, 7, 'Routine Check-up', 'U'),
    (8, 8, 6, 4, 'Specialist Referral', 'U'),
    (9, 9, 35, 5, 'Follow-up', 'U'),
    (10, 10, 29, 4, 'Routine Check-up', 'U'),
    (11, 11, 73, 3, 'Specialist Referral', 'U'),
    (12, 12, 50, 7, 'Follow-up', 'U'),
    (13, 13, 33, 3, 'Routine Check-up', 'U'),
    (14, 14, 73, 6, 'Specialist Referral', 'U'),
    (15, 15, 33, 4, 'Follow-up', 'U'),
    (16, 16, 27, 3, 'Consultation', 'U'),
    (17, 17, 49, 4, 'Consultation', 'U'),
    (18, 18, 47, 1, 'Consultation', 'U'),
    (19, 19, 14, 4, 'Consultation', 'U'),
    (20, 20, 30, 5, 'Consultation', 'U');