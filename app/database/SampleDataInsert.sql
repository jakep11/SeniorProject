source SP_TableSetup.sql;  -- clear database, can remove later
-- User
/*password: password1*/
INSERT INTO User SET firstName = 'User1', lastName = 'Admin', 
 email = 'user1@example.com', role = 1, termsAccepted = '2015-01-01 12:00:00',
 passHash = '$2a$10$V0LmHOblkiYzJVcEiKtmKOdXlt8yZQQ/JLlyUSitUEKPWnWoT3aPq';

/*password: passwordA*/
INSERT INTO User SET firstName = 'UserA', lastName = 'Student', 
 email = 'userA@example.com', role = 0, termsAccepted = '2015-09-15 17:30:18',
 passHash = '$2a$10$rH3QVGByP9cWyZLDwZQft.TiLe1WCDQMeazQ5dZ6LQy/2xBnbxejO';

/*password: passwordB*/
INSERT INTO User SET firstName = 'UserB', lastName = 'Student', 
 email = 'userB@example.com', role = 0, termsAccepted = '2017-01-25 22:49:32',
 passHash = '$2a$10$RSSFoeJAdnAo0SQ70h7YMeV0Tus7Q2Ml9iv.RoMFKG72h7dVYa7aK';

/*password: passwordC*/
INSERT INTO User SET firstName = 'UserC', lastName = 'Student', 
 email = 'userC@example.com', role = 0, termsAccepted = '2016-10-07 10:09:11',
 passHash = '$2a$10$IqGbNmYDcIp5h0Cj4/DvweEjHw1hhOsDFu8e3qFULcIWf6ZQKyM8S';
-- ----------------------------------------------------------------------------

-- Section 
INSERT INTO Section SET name = 'CPE133', 
 description = 'Digital Design', term = 'S18';
INSERT INTO Section SET name = 'CPE357', 
 description = 'Systems Programming', term = 'W16';
INSERT INTO Section SET name = 'CPE365', 
 description = 'Introduction to Database Systems', term = 'F16';
INSERT INTO Section SET name = 'CSC437', 
 description = 'Dynamic Web Development', term = 'W17';
INSERT INTO Section SET name = 'CPE233', 
 description = 'Computer Design and Assembly Language Programming', 
 term = 'W17';
-- ----------------------------------------------------------------------------

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
INSERT INTO Topic SET name = 'JSAdvanced', sectionId = 4;
INSERT INTO Topic SET name = 'JSObjectOriented', sectionId = 4;
INSERT INTO Topic SET name = 'Cache', sectionId = 4;

-- CPE233
INSERT INTO Topic SET name = 'Branch Instructions', sectionId = 5;
INSERT INTO Topic SET name = 'Logical Instructions', sectionId = 5;
INSERT INTO Topic SET name = 'ALU', sectionId = 5;
INSERT INTO Topic SET name = 'FSM', sectionId = 5;
INSERT INTO Topic SET name = 'I/O', sectionId = 5;
-- ----------------------------------------------------------------------------

-- Enrollment
INSERT INTO Enrollment SET userId = 3, sectionId = 2;
INSERT INTO Enrollment SET userId = 3, sectionId = 4;
INSERT INTO Enrollment SET userId = 4, sectionId = 1;
INSERT INTO Enrollment SET userId = 4, sectionId = 5;
INSERT INTO Enrollment SET userId = 5, sectionId = 3;
INSERT INTO Enrollment SET userId = 5, sectionId = 4;
INSERT INTO Enrollment SET userId = 5, sectionId = 2;
-- ----------------------------------------------------------------------------

-- Video
-- CPE133
INSERT INTO Video SET name = '2s compliment', link = 'bGiLEhWqQkM',
 topicId = 1, dueDate = '2018-04-10 23:00:00';
INSERT INTO Video SET name = 'Boolean Basics', link = 'VmG0x2fsYic',
 topicId = 2, dueDate = '2018-04-17 23:00:00';
INSERT INTO Video SET name = 'KMap 4Variables', link = 'ywoAK-L5C0g',
 topicId = 3, dueDate = '2018-04-25 23:00:00';
INSERT INTO Video SET name = 'Generic Decoders', link = 'XuLoiJRuXb8',
 topicId = 4, dueDate = '2018-05-03 23:00:00';
INSERT INTO Video SET name = 'unsigned AddSub', link = 'lOx0VJFKA2s',
 topicId = 5, dueDate = '2018-05-15 23:00:00';
INSERT INTO Video SET name = 'T JKFF', link = 'bu-OseFcKsg',
 topicId = 6, dueDate = '2018-05-20 23:00:00';
INSERT INTO Video SET name = 'Intro To Sequential', link = 'w-vU8Ab6VWE',
 topicId = 7, dueDate = '2018-06-01 23:00:00';

-- CSC437
INSERT INTO Video SET name = 'JSObjects', link = 'VaMU3wyK0zE',
 topicId = 19, dueDate = '2017-02-10 23:59:59';
INSERT INTO Video SET name = 'InheritanceA', link = 'wMAQTikkJxE',
 topicId = 18, dueDate = '2017-01-15 23:59:59';
INSERT INTO Video SET name = 'InheritanceB', link = '1IveCSIBh_g',
 topicId = 18, dueDate = '2017-01-15 23:59:59';
INSERT INTO Video SET name = 'InheritanceC', link = 'LwwnGgTWfCA',
 topicId = 18, dueDate = '2017-01-15 23:59:59';
INSERT INTO Video SET name = 'Optimization', link = 'dYCn2lX--3c',
 topicId = 20, dueDate = '2017-03-12 23:59:59';

-- CSC365
INSERT INTO Video SET name = 'Creating DBs', link = 'aaBa0rANf8U', 
 topicId = 14, dueDate = '2016-11-05 23:59:59';
INSERT INTO Video SET name = 'SubQueries', link = '1zit-lQ88Ws', 
 topicId = 16, dueDate = '2016-11-20 23:59:59';
INSERT INTO Video SET name = 'Relational Algebra A', link = 'equ58Tfl5gk', 
 topicId = 13, dueDate = '2016-10-25 23:59:59';
INSERT INTO Video SET name = 'Aggregation', link = 'OXJAOpf51CA', 
 topicId = 15, dueDate = '2016-11-15 23:59:59';
INSERT INTO Video SET name = 'JDBC Intro', link = '7-VISk62zYI', 
 topicId = 17, dueDate = '2016-11-25 23:59:59';

-- CSC233
INSERT INTO Video SET name = 'Branch Instructions', link = 'ysXyjHVpQN4', 
 topicId = 21, dueDate = '2017-01-15 23:59:59';
INSERT INTO Video SET name = 'Logical Instructions', link = '7TJCNq-pEIA', 
 topicId = 22, dueDate = '2017-01-25 23:59:59';
INSERT INTO Video SET name = 'ALU', link = 'Ub67x9ZWFBI', 
 topicId = 23, dueDate = '2017-02-10 23:59:59';
INSERT INTO Video SET name = 'Example FSM', link = 'K7E7Chnsqw4', 
 topicId = 24, dueDate = '2017-02-28 23:59:59';
INSERT INTO Video SET name = 'I/O Intro', link = 's5ckh_eQ0aI', 
 topicId = 25, dueDate = '2017-03-05 23:59:59';

-- CSC357
-- ----------------------------------------------------------------------------
-- Exercise
-- ----------------------------------------------------------------------------
-- Document
-- ----------------------------------------------------------------------------

