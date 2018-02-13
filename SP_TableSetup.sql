/*
	Initial setup files database
*/
DROP DATABASE IF EXISTS SeniorProject;
CREATE DATABASE SeniorProject;
USE SeniorProject;

CREATE TABLE Course (
	CourseId INT AUTO_INCREMENT,
	Dept VARCHAR(5) NOT NULL,
	CourseNum INT NOT NULL,
	CourseName VARCHAR(100),
	PRIMARY KEY (CourseId),
	UNIQUE (Dept, CourseNum)
);

CREATE TABLE User (
	UserId INT AUTO_INCREMENT,
	FName VARCHAR(50) NOT NULL,
	LName VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Role INT NOT NULL DEFAULT 0, /* need to look at rest spec for default*/
	PRIMARY KEY (UserId),
	UNIQUE (FName, LName, Email)
);

CREATE TABLE CourseEnrolled (
	EnrolledId INT AUTO_INCREMENT,
	UserId INT,
	CourseId INt,
	PRIMARY KEY (EnrolledId),
	UNIQUE (UserId, CourseId),
	FOREIGN KEY (UserId) REFERENCES User(UserId),
	FOREIGN KEY (CourseId) REFERENCES Course(CourseId)
);

CREATE TABLE CourseTOC (
	CrsTocId INT AUTO_INCREMENT,
	CourseId INT,
	TopicName VARCHAR(100),
	PRIMARY KEY (CrsTocId),
	UNIQUE (CourseId, TopicName),
	FOREIGN KEY (CourseId) REFERENCES Course(CourseId)
);

CREATE TABLE Document (
	DocId INT AUTO_INCREMENT,
	CrsTocId INT,
	DocName VARCHAR(100),
	Doc BLOB,
	PRIMARY KEY (DocId),
	FOREIGN KEY (CrsTocId) REFERENCES CourseTOC(CrsTocId)
);

/*File storage
  Might not need if auto generated 
*/
CREATE TABLE Exercise (
	ExrcId INT AUTO_INCREMENT,
	CrsTocId INT,
	Question VARCHAR(500),
	Answer VARCHAR(250),
	PRIMARY KEY (ExrcId),
	UNIQUE (CrsTocId, Question),
	FOREIGN KEY (CrsTocId) REFERENCES CourseTOC(CrsTocId)
);

CREATE TABLE CourseProg (
    ProgId INT AUTO_INCREMENT,
    UserId INT NOT NULL,
    CrsTocId INT NOT NULL,
    ExrcId INT NOT NULL,
    Attempted BOOLEAN DEFAULT FALSE,
    NumAttempt INT DEFAULT 0,
    GradeReceived REAL,
    PRIMARY KEY (ProgId),
    UNIQUE (UserId , CrsTocId , ExrcId),
    FOREIGN KEY (UserId)
        REFERENCES User (UserId),
    FOREIGN KEY (CrsTocId)
        REFERENCES CourseTOC (CrsTocId),
    FOREIGN KEY (ExrcId)
        REFERENCES Exercise (ExrcId)
);