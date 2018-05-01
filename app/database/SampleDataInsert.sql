-- User
/*password: password1*/
INSERT INTO User SET firstName = 'User1', lastName = 'Admin', 
 email = 'user1@example.com', role = 1, termsAccepted = '2015-01-01 12:00:00',
 passHash = '$2y$10$5yXPitWVHJhI0/uBjT/WFeY/Z9ETEByV7cpvwbPsgQYZSyEl1iaKW';

/*password: passwordA*/
INSERT INTO User SET firstName = 'UserA', lastName = 'Student', 
 email = 'userA@example.com', role = 0, termsAccepted = '2015-09-15 17:30:18',
 passHash = '$2y$10$MoLQ7gkTHQyx4nE1ON0pourz2/2rOWowsi3KmBYHCs8S2Ck2caVLe';

/*password: passwordB*/
INSERT INTO User SET firstName = 'UserB', lastName = 'Student', 
 email = 'userB@example.com', role = 0, termsAccepted = '2017-01-25 22:49:32',
 passHash = '$2y$10$GyVp8WWFzKwIraljKCZx3OHkDc60kHZjQGh4AAS1n/i1Os1kg7mJO';

/*password: passwordC*/
INSERT INTO User SET firstName = 'UserC', lastName = 'Student', 
 email = 'userC@example.com', role = 0, termsAccepted = '2016-10-07 10:09:11',
 passHash = '$2y$10$mNKOj6o2.BuTlgw5Bxc0g.SYNeCK9sxQ.ww0qpPHsJ4pwsioB1t3W';
-------------------------------------------------------------------------------

-- Section 
INSERT INTO Section SET name = 'CPE133', 
 description = 'Digital Design', term = 'S18';
INSERT INTO Section SET name = 'CPE357', 
 description = 'Systems Programming', term = 'W16';
INSERT INTO Section SET name = 'CPE365', 
 description = 'Introduction to Database Systems', term = 'F16';
INSERT INTO Section SET name = 'CSC437', 
 description = 'Dynamic Web Development', term = 'W17';
INSERT INTO Section SET name = 'MATH143', 
 description = 'Calculus III', term = 'W17';
-------------------------------------------------------------------------------

-- Topic
-- CPE133
INSERT INTO Topic SET name = 'Number Systems', sectionId = 1;
INSERT INTO Topic SET name = 'Boolean Algebra', sectionId = 1;
INSERT INTO Topic SET name = 'K-Maps', sectionId = 1;
INSERT INTO Topic SET name = 'Combitional Logic', sectionId = 1;
INSERT INTO Topic SET name = 'Adder Circuits', sectionId = 1;
INSERT INTO Topic SET name = 'Latches & Flip-Flops', sectionId = 1;
INSERT INTO Topic SET name = 'Sequential Logic', sectionId = 1;

-- CPE357
INSERT INTO Topic SET name = 'Intro to C', sectionId = 2;
INSERT INTO Topic SET name = 'Memeory Management', sectionId = 2;
INSERT INTO Topic SET name = 'Dynamic Data Structures', sectionId = 2;
INSERT INTO Topic SET name = 'Process Environment & Control', sectionId = 2;
INSERT INTO Topic SET name = 'File I/O', sectionId = 2;

-- CPE365
INSERT INTO Topic SET name = 'Relational Algebra', sectionId = 3;
INSERT INTO Topic SET name = 'Database Design', sectionId = 3;
INSERT INTO Topic SET name = 'Database Analysis', sectionId = 3;
INSERT INTO Topic SET name = 'Advance Queries', sectionId = 3;
INSERT INTO Topic SET name = 'JDBC', sectionId = 3;

-- CSC437
INSERT INTO Topic SET name = 'JSBasics', sectionId = 4;
INSERT INTO Topic SET name = 'JSAdvanced', sectionId = 4;
INSERT INTO Topic SET name = 'JSObjectOriented', sectionId = 4;

-- MATH143
INSERT INTO Topic SET name = 'Parameterization', sectionId = 5;
INSERT INTO Topic SET name = 'Sequence', sectionId = 5;
INSERT INTO Topic SET name = 'Series', sectionId = 5;
INSERT INTO Topic SET name = 'Three-space', sectionId = 5;
INSERT INTO Topic SET name = 'Vector', sectionId = 5;
-------------------------------------------------------------------------------

-- Enrollment
INSERT INTO Enrollment SET userId = 3, sectionId = 2;
INSERT INTO Enrollment SET userId = 3, sectionId = 4;
INSERT INTO Enrollment SET userId = 4, sectionId = 1;
INSERT INTO Enrollment SET userId = 4, sectionId = 5;
INSERT INTO Enrollment SET userId = 5, sectionId = 3;
INSERT INTO Enrollment SET userId = 5, sectionId = 4;
INSERT INTO Enrollment SET userId = 5, sectionId = 2;

-- Video
-- CSC 365
INSERT INTO Video SET name = 'Creating DBs', link = 'aaBa0rANf8U', 
 topicId = 14, dueDate = '2016-11-05 23:59:59';
INSERT INTO Video SET name = 'SubQueries', link = '1zit-lQ88Ws', 
 topicId = 16, dueDate = '2016-11-15 23:59:59';
INSERT INTO Video SET name = 'Relational Algebra - Lecture A', link = 'equ58Tfl5gk', 
 topicId = 13, dueDate = '2016-10-25 23:59:59';
INSERT INTO Video SET name = 'Aggregation', link = 'OXJAOpf51CA', 
 topicId = 14, dueDate = '2016-11-05 23:59:59';
INSERT INTO Video SET name = 'Creating DBs', link = 'aaBa0rANf8U', 
 topicId = 14, dueDate = '2016-11-05 23:59:59';

-- Exercise
-- Document


