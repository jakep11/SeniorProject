/*
	Initial setup files database
*/
DROP DATABASE IF EXISTS SeniorProject;
CREATE DATABASE SeniorProject;
USE SeniorProject;

CREATE TABLE Section (
	Id INT AUTO_INCREMENT,
	Name VARCHAR(10) NOT NULL,
	Description VARCHAR(100) NOT NULL,
	Term CHAR(3),
	PRIMARY KEY (Id)
);

CREATE TABLE User (
	Id INT AUTO_INCREMENT,
	FName VARCHAR(50) NOT NULL,
	LName VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Role INT NOT NULL DEFAULT 0, /* need to look at rest spec for default*/
	PassHash VARCHAR(100) NOT NULL,
    PRIMARY KEY (Id),
	UNIQUE (FName, LName, Email)
);

CREATE TABLE Enrollment (
    Id INT AUTO_INCREMENT,
    UserId INT,
    SectionId INT,
    PRIMARY KEY (Id),
    UNIQUE (UserId , SectionId),
    FOREIGN KEY (UserId)
        REFERENCES User (Id),
    FOREIGN KEY (SectionId)
        REFERENCES Section (Id)
);

CREATE TABLE Topic (
	Id INT AUTO_INCREMENT,
	Name VARCHAR(100),
    SectionId INT,
	PRIMARY KEY (Id),
	UNIQUE (Name, SectionId),
	FOREIGN KEY (SectionId) REFERENCES Section(Id)
);


CREATE TABLE Video (
	Id INT AUTO_INCREMENT,
    Name VARCHAR(100),
	Link VARCHAR(500),
    TopicId INT,
	PRIMARY KEY (Id),
	UNIQUE (TopicId, Name, Link),
	FOREIGN KEY (TopicId) REFERENCES Topic(Id)
);


CREATE TABLE Exercise (
	Id INT AUTO_INCREMENT,
    Name VARCHAR(100),
	Question VARCHAR(500),
	Answer VARCHAR(250),
    Type VARCHAR(50) NOT NULL,
    Points INT NOT NULL,
    TopicId INT NOT NULL,
	PRIMARY KEY (Id),
	UNIQUE (TopicId, Question, Answer),
	FOREIGN KEY (TopicId) REFERENCES Topic(Id)
);

CREATE TABLE Document (
	Id INT AUTO_INCREMENT,
	Name VARCHAR(50),
	Content BLOB,
    TopicId INT,
	PRIMARY KEY (Id),
	FOREIGN KEY (TopicId) REFERENCES Topic(Id)
);

CREATE TABLE Progress (
    UserId INT NOT NULL,
    ActivityType INT,
    ActivityId INT,
    TopicId INT,
    Grade REAL,
    Attempted BOOLEAN,
    PRIMARY KEY (ActivityType, ActivityId),
    UNIQUE (UserId, TopicId , ActivityId),
    FOREIGN KEY (UserId)
        REFERENCES User(Id),
    FOREIGN KEY (TopicId)
        REFERENCES Topic(Id)
);