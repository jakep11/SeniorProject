/*
   Initial setup files database
*/
DROP DATABASE IF EXISTS SeniorProject;
CREATE DATABASE SeniorProject;
USE SeniorProject;

CREATE TABLE Section (
   id INT AUTO_INCREMENT,
   name VARCHAR(10) NOT NULL,
   description VARCHAR(100) NOT NULL,
   term CHAR(3),
   PRIMARY KEY (id)
);

CREATE TABLE User (
   id INT AUTO_INCREMENT,
   firstName VARCHAR(50) NOT NULL,
   lastName VARCHAR(50) NOT NULL,
   email VARCHAR(50) NOT NULL,
   role INT NOT NULL DEFAULT 0, /* need to look at rest spec for default*/
   passHash VARCHAR(100) NOT NULL,
   termsAccepted DATETIME, 
   PRIMARY KEY (id),
   UNIQUE (firstName, lastName, email)
);

CREATE TABLE Enrollment (
   id INT AUTO_INCREMENT,
   userId INT,
   sectionId INT,
   PRIMARY KEY (Id),
   UNIQUE (UserId , SectionId),
   FOREIGN KEY (userId) REFERENCES User (id) on delete cascade 
   on update cascade,
   FOREIGN KEY (sectionId) REFERENCES Section (id) on delete cascade 
   on update cascade
);

CREATE TABLE Topic (
   id INT AUTO_INCREMENT,
   name VARCHAR(500),
   sectionId INT,
   PRIMARY KEY (id),
   UNIQUE (name, sectionId),
   FOREIGN KEY (sectionId) REFERENCES Section(id) on delete cascade 
   on update cascade
);


CREATE TABLE Video (
   id INT AUTO_INCREMENT,
   name VARCHAR(100),
   link VARCHAR(500),
   dueDate DATETIME,
   topicId INT,
   PRIMARY KEY (id),
   UNIQUE (topicId, name, link),
   FOREIGN KEY (topicId) REFERENCES Topic(id) on delete cascade 
   on update cascade
);


CREATE TABLE Exercise (
   id INT AUTO_INCREMENT,
   name VARCHAR(100),
   question VARCHAR(500),
   answer VARCHAR(250),
   type VARCHAR(50) NOT NULL,
   points INT NOT NULL,
   dueDate DATETIME,
   topicId INT NOT NULL,
   PRIMARY KEY (id),
   UNIQUE (topicId, question, answer),
   FOREIGN KEY (topicId) REFERENCES Topic(id) on delete cascade 
   on update cascade
);

CREATE TABLE Document (
   id INT AUTO_INCREMENT,
   name VARCHAR(50),
   content BLOB,
   dueDate DATETIME,
   topicId INT,
   PRIMARY KEY (id),
   FOREIGN KEY (topicId) REFERENCES Topic(id) on delete cascade 
   on update cascade
);

CREATE TABLE Progress (
    userId INT NOT NULL,
    activityType INT,
    activityId INT,
    topicId INT,
    grade REAL,
    attempted BOOLEAN,
    whenCompleted DATETIME,
    PRIMARY KEY (activityType, activityId),
    UNIQUE (userId, topicId, activityId),
    FOREIGN KEY (userId) REFERENCES User(id) on delete cascade 
    on update cascade,
    FOREIGN KEY (topicId) REFERENCES Topic(id) on delete cascade 
    on update cascade
);

insert into User (firstName, lastName, email, passHash, termsAccepted, role)
   VALUES ("Joe", "Admin", "admin@example.com", 
   "$2a$10$Nq2f5SyrbQL2R0e9E.cU2OSjqqORgnwwsY1vBvVhV.SGlfzpfYvyi", NOW(), 1);