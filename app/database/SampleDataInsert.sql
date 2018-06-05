source SP_TableSetup.sql;  -- clear database, can remove later
-- ----------------------------------------------------------------------------
-- User
-- ----------------------------------------------------------------------------

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
-- ----------------------------------------------------------------------------

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
-- ----------------------------------------------------------------------------

-- CPE133
INSERT INTO Topic SET name = 'Number Systems', sectionId = 1;
INSERT INTO Topic SET name = 'Boolean Algebra', sectionId = 1;
INSERT INTO Topic SET name = 'K-Maps', sectionId = 1;
INSERT INTO Topic SET name = 'Combitional Logic', sectionId = 1;
INSERT INTO Topic SET name = 'Adder Circuits', sectionId = 1;
INSERT INTO Topic SET name = 'Latches & Flip-Flops', sectionId = 1;
INSERT INTO Topic SET name = 'Sequential Logic', sectionId = 1;

-- ----------------------------------------------------------------------------
-- CPE357
INSERT INTO Topic SET name = 'Intro to C', sectionId = 2;
INSERT INTO Topic SET name = 'Memeory Management', sectionId = 2;
INSERT INTO Topic SET name = 'Dynamic Data Structures', sectionId = 2;
INSERT INTO Topic SET name = 'Process Environment & Control', sectionId = 2;
INSERT INTO Topic SET name = 'File I/O', sectionId = 2;

-- ----------------------------------------------------------------------------
-- CPE365
INSERT INTO Topic SET name = 'Relational Algebra', sectionId = 3;
INSERT INTO Topic SET name = 'Database Design', sectionId = 3;
INSERT INTO Topic SET name = 'Database Analysis', sectionId = 3;
INSERT INTO Topic SET name = 'Advance Queries', sectionId = 3;
INSERT INTO Topic SET name = 'JDBC', sectionId = 3;

-- ----------------------------------------------------------------------------
-- CSC437
INSERT INTO Topic SET name = 'JSAdvanced', sectionId = 4;
INSERT INTO Topic SET name = 'JSObjectOriented', sectionId = 4;
INSERT INTO Topic SET name = 'Cache', sectionId = 4;

-- ----------------------------------------------------------------------------
-- CPE233
INSERT INTO Topic SET name = 'Branch Instructions', sectionId = 5;
INSERT INTO Topic SET name = 'Logical Instructions', sectionId = 5;
INSERT INTO Topic SET name = 'ALU', sectionId = 5;
INSERT INTO Topic SET name = 'FSM', sectionId = 5;
INSERT INTO Topic SET name = 'I/O', sectionId = 5;

-- ----------------------------------------------------------------------------
-- Enrollment
-- ----------------------------------------------------------------------------

INSERT INTO Enrollment SET userId = 3, sectionId = 2;
INSERT INTO Enrollment SET userId = 3, sectionId = 4;
INSERT INTO Enrollment SET userId = 4, sectionId = 1;
INSERT INTO Enrollment SET userId = 4, sectionId = 5;
INSERT INTO Enrollment SET userId = 5, sectionId = 3;
INSERT INTO Enrollment SET userId = 5, sectionId = 4;
INSERT INTO Enrollment SET userId = 5, sectionId = 2;

-- ----------------------------------------------------------------------------
-- Video
-- ----------------------------------------------------------------------------
-- Video src: youtube user
-- CPE133 Bridget Benson
-- CSC347 Clint Staley
-- CSC365 Clint Staley
-- CPE233 Bridget Benson
-- CSC357 Clint Staley
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- CPE233
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

-- ----------------------------------------------------------------------------
-- CSC357
INSERT INTO Video SET name = 'General Types', link = 'pXLUj93rXFI', 
 topicId = 8, dueDate = '2016-01-15 23:59:59';
INSERT INTO Video SET name = 'Pointers', link = '5YkIHBwuB-o', 
 topicId = 9, dueDate = '2016-01-25 23:59:59';
INSERT INTO Video SET name = 'Dynamic 2-D array', link = 'Bt9rTV6je3w', 
 topicId = 10, dueDate = '2016-02-10 23:59:59';

-- ----------------------------------------------------------------------------
-- Exercise
-- ----------------------------------------------------------------------------

-- CSC357
INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Who designed C programming language?', 
 answer = 'Dennis M Ritchie', type = 'FreeResponse', points = 1, 
 dueDate = '2016-01-16 23:59:59', topicId = 8;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'S++ or S = S+1, which can be recommended to increment the value', 
 answer = 'S++', type = 'FreeResponse', points = 1, 
 dueDate = '2016-01-16 23:59:59', topicId = 8;
INSERT INTO Exercise SET name = 'Problem C', 
 question = 'Can a program be compiled without main() function?', 
 answer = 'Yes', type = 'MultipleChoice', points = 1, 
 dueDate = '2016-01-16 23:59:59', topicId = 8;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Which built-in library function can be used to re-size 
 the allocated dynamic memory?', 
 answer = 'realloc()', type = 'FreeResponse', points = 1, 
 dueDate = '2016-01-25 23:59:59', topicId = 9;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'Which operator can be used to determine the size of a 
 data type or variable?', 
 answer = 'sizeof', type = 'MultipleChoice', points = 1, 
 dueDate = '2016-01-25 23:59:59', topicId = 9;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'What is the meaning of base address of the array?', 
 answer = 'starting address', type = 'FreeResponse', points = 1, 
 dueDate = '2016-02-10 23:59:59', topicId = 10;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'Which function is used to release the dynamic allocated memory?', 
 answer = 'free()', type = 'MultipleChoice', points = 1, 
 dueDate = '2016-02-28 23:59:59', topicId = 11;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Can variables belonging to different scope have same name?', 
 answer = 'Yes', type = 'FreeResponse', points = 1, 
 dueDate = '2016-02-28 23:59:59', topicId = 11;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Is FILE a built-in data type?', 
 answer = 'No', type = 'FreeResponse', points = 1, 
 dueDate = '2016-03-06 23:59:59', topicId = 12;

-- ----------------------------------------------------------------------------
-- CSC365
INSERT INTO Exercise SET name = 'Problem A', 
 question = 'A base operation defined by T ={t|tER and !(tES)}', 
 answer = 'Difference', type = 'FreeResponse', points = 1, 
 dueDate = '2016-10-26 23:59:59', topicId = 13;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'A join that looks at all common attributes of two relations and
  joins on them', 
 answer = 'Natural', type = 'MultipleChoice', points = 1, 
 dueDate = '2016-10-26 23:59:59', topicId = 13;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'What does DDL stand for?', 
 answer = 'Data Definition Language', type = 'FreeResponse', points = 1, 
 dueDate = '2016-11-05 23:59:59', topicId = 14;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'What does DML stand for?', 
 answer = 'Data Manipulation Language', type = 'FreeResponse', points = 1, 
 dueDate = '2016-11-15 23:59:59', topicId = 15;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'A query contained by a query', 
 answer = 'Sub-query', type = 'FreeResponse', points = 1, 
 dueDate = '2016-11-20 23:59:59', topicId = 16;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'Helps in explaining the relation between different tables', 
 answer = 'Joins', type = 'FreeResponse', points = 1, 
 dueDate = '2016-11-20 23:59:59', topicId = 16;

-- ----------------------------------------------------------------------------
-- CPE233
INSERT INTO Exercise SET name = 'Problem A', 
 question = 'List 4 different conditional branches (separated by comma)', 
 answer = 'Equal,Not Equal,Carry Set,Carry clear', type = 'FreeResponse', points = 1, 
 dueDate = '2017-01-15 23:59:59', topicId = 21;

INSERT INTO Exercise SET name = 'Problem A',
 question = 'List 4 different logic operations as mentioned in the video (separated by comma)', 
 answer = 'AND,OR,ERROR,Test', type = 'FreeResponse', points = 1, 
 dueDate = '2017-01-25 23:59:59', topicId = 22;

INSERT INTO Exercise SET name = 'Problem A',
 question = 'How many operations does RAT ALU support?', 
 answer = '16', type = 'MultipleChoice', points = 1, 
 dueDate = '2017-02-10 23:59:59', topicId = 23;

INSERT INTO Exercise SET name = 'Problem A',
 question = 'What does FSM stand for?', 
 answer = 'Finite State Machine', type = 'FreeResponse', points = 1, 
 dueDate = '2017-02-28 23:59:59', topicId = 24;

INSERT INTO Exercise SET name = 'Problem A',
 question = 'What are the 3 I/O signals drawn in the video', 
 answer = 'IN_PORT,OUT_PORT,PORT_ID', type = 'MultipleChoice', points = 1, 
 dueDate = '2017-03-05 23:59:59', topicId = 25;

-- ----------------------------------------------------------------------------
-- CPE133
INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Convert 100 to binary.', 
 answer = '1100100', type = 'FreeResponse', points = 1, 
 dueDate = '2018-04-10 23:00:00', topicId = 1;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'Convert 1111 to decimal', 
 answer = '15', type = 'FreeResponse', points = 1, 
 dueDate = '2018-04-10 23:00:00', topicId = 1;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Evaluate 1 XOR 0', 
 answer = '1', type = 'FreeResponse', points = 1, 
 dueDate = '2018-04-17 23:00:00', topicId = 2;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'Evaluate (A+B+C)(D+E)! + (A+B+C)(D+E), where * = AND, + = OR, ! = NOT', 
 answer = 'A + B + C', type = 'FreeResponse', points = 1, 
 dueDate = '2018-04-17 23:00:00', topicId = 2;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Number of cells in a 4-variable K-map', 
 answer = '16', type = 'FreeResponse', points = 1, 
 dueDate = '2018-04-25 23:00:00', topicId = 3;
INSERT INTO Exercise SET name = 'Problem B', 
 question = 'The K-map based Boolean reduction is based on the following Unifying Theorem: A + A’ = 1', 
 answer = 'Non Impact', type = 'FreeResponse', points = 1, 
 dueDate = '2018-04-25 23:00:00', topicId = 3;

INSERT INTO Exercise SET name = 'Problem A', 
 question = '3 bits full adder contains', 
 answer = '8 combinational inputs', type = 'FreeResponse', points = 1, 
 dueDate = '2018-05-03 23:00:00', topicId = 4;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Total number of inputs in a half adder is', 
 answer = '2', type = 'MultipleChoice', points = 1, 
 dueDate = '2018-05-15 23:00:00', topicId = 5;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'How many stable state in a latch', 
 answer = '2', type = 'FreeResponse', points = 1, 
 dueDate = '2018-05-20 23:00:00', topicId = 6;

-- INSERT INTO Exercise SET name = 'Problem A', question = '', 
--  answer = '', type = 'MultipleChoice', points = 1, 
--  dueDate = '2018-06-01 23:00:00', topicId = 7;

-- ----------------------------------------------------------------------------
-- CSC437
INSERT INTO Exercise SET name = 'Problem A', 
 question = 'Fill in the equality check: f.__proto__ === ______________________', 
 answer = 'Function.prototype. f', type = 'MultipleChoice', points = 1, 
 dueDate = '2017-01-15 23:59:59', topicId = 18;

INSERT INTO Exercise SET name = 'Problem A', 
 question = 'In the method call list.add(42), how many parameters does add tuly have?', 
 answer = '2', type = 'FreeResponse', points = 1, 
 dueDate = '2017-02-10 23:59:59', topicId = 19;

-- INSERT INTO Exercise SET name = 'Problem A', question = '', 
--  answer = '', type = 'FreeResponse', points = 1, 
--  dueDate = '2017-03-12 23:59:59', topicId = 20;

-- ----------------------------------------------------------------------------
-- Document
-- ----------------------------------------------------------------------------

-- CPE133
INSERT INTO Document SET name = "1.pdf", 
 contentPath= "/1/", dueDate = '2018-04-10 23:00:00', topicId = 1;
INSERT INTO Document SET name = "2.pdf", 
 contentPath= "/2/", dueDate = '2018-04-17 23:00:00', topicId = 2;
INSERT INTO Document SET name = "3.pdf", 
 contentPath= "/3/", dueDate = '2018-04-25 23:00:00', topicId = 3;
INSERT INTO Document SET name = "4.pdf", 
 contentPath= "/4/", dueDate = '2018-05-03 23:00:00', topicId = 4; 
INSERT INTO Document SET name = "5.pdf", 
 contentPath= "/5/", dueDate = '2018-05-15 23:00:00', topicId = 5;
INSERT INTO Document SET name = "6.pdf", 
 contentPath= "/6/", dueDate = '2018-05-20 23:00:00', topicId = 6;
INSERT INTO Document SET name = "7.pdf", 
 contentPath= "/7/", dueDate = '2018-06-01 23:00:00', topicId = 7;

-- ----------------------------------------------------------------------------
-- CPE357
INSERT INTO Document SET name = "1.pdf", 
 contentPath= "/8/", dueDate = '2016-01-15 23:59:59', topicId = 8;
INSERT INTO Document SET name = "2.pdf", 
 contentPath= "/9/", dueDate = '2016-01-25 23:59:59', topicId = 9;
INSERT INTO Document SET name = "3.pdf", 
 contentPath= "/10/", dueDate = '2016-02-10 23:59:59', topicId = 10;
INSERT INTO Document SET name = "4.pdf", 
 contentPath= "/11/", dueDate = '2016-02-17 23:59:59', topicId = 11;
INSERT INTO Document SET name = "5.pdf", 
 contentPath= "/12/", dueDate = '2016-02-25 23:59:59', topicId = 12;

-- ----------------------------------------------------------------------------
-- CPE365
INSERT INTO Document SET name = "6.pdf", 
 contentPath= "/13/", dueDate = '2016-10-25 23:59:59', topicId = 13;
INSERT INTO Document SET name = "7.pdf", 
 contentPath= "/14/", dueDate = '2016-11-05 23:59:59', topicId = 14;
INSERT INTO Document SET name = "1.pdf", 
 contentPath= "/15/", dueDate = '2016-11-15 23:59:59', topicId = 15;
INSERT INTO Document SET name = "2.pdf", 
 contentPath= "/16/", dueDate = '2016-11-20 23:59:59', topicId = 16;

-- ----------------------------------------------------------------------------
-- CPE437
INSERT INTO Document SET name = "3.pdf", 
 contentPath= "/17/", dueDate = '2017-01-10 23:00:00', topicId = 17;
INSERT INTO Document SET name = "4.pdf", 
 contentPath= "/18/", dueDate = '2017-01-15 23:59:59', topicId = 18;
INSERT INTO Document SET name = "5.pdf", 
 contentPath= "/19/", dueDate = '2017-02-10 23:59:59', topicId = 19;
INSERT INTO Document SET name = "6.pdf", 
 contentPath= "/20/", dueDate = '2017-03-12 23:59:59', topicId = 20;

-- ----------------------------------------------------------------------------
-- CPE233
INSERT INTO Document SET name = "7.pdf", 
 contentPath= "/21/", dueDate = '2017-01-15 23:59:59', topicId = 21;
INSERT INTO Document SET name = "1.pdf", 
 contentPath= "/22/", dueDate = '2017-01-25 23:59:59', topicId = 22;
INSERT INTO Document SET name = "2.pdf", 
 contentPath= "/23/", dueDate = '2017-02-10 23:59:59', topicId = 23;
INSERT INTO Document SET name = "3.pdf", 
 contentPath= "/24/", dueDate = '2017-02-28 23:59:59', topicId = 24;
INSERT INTO Document SET name = "4.pdf", 
 contentPath= "/25/", dueDate = '2017-03-05 23:59:59', topicId = 25;

-- ----------------------------------------------------------------------------
-- Progress
-- ----------------------------------------------------------------------------
source populateProgress.sql; -- populate Progress
-- CPE133
-- ----------------------------------------------------------------------------
-- CPE357
-- ----------------------------------------------------------------------------
-- CPE365
-- ----------------------------------------------------------------------------
-- CSC437
-- ----------------------------------------------------------------------------
-- CPE233