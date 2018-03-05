/* SQL Queries
   Senior Project */

-- User Management
-- GET
	SELECT * FROM User WHERE Email LIKE ? -- with email
	SELECT * FROM User -- no email
-- POST
	SELECT * FROM User WHERE Email = ? -- check for duplicate
	INSERT INTO User SET ?

-- ID
-- GET
	SELECT * FROM User WHERE Id = ?
-- PUT
	SELECT * FROM User WHERE Id = ? -- check if user w/ id exists
	UPDATE User SET ? WHERE Id = ?
-- DELETE
	DELETE FROM User WHERE Id = ?

-- Session Management
/* NO SQL QRY FOR THIS */
-------------------------------------------------------------------------------
-- Topic Management
-- GET
	SELECT * FROM Topic WHERE SectionId = ? -- given sectionId
	SELECT * FROM Topic -- no sectionId
-- POST
	SELECT * FROM Topic WHERE SectionId = ? and Name = ? -- check duplicate
	INSERT INTO Topic SET ?

-- ID
-- GET 
	SELECT * FROM Topic WHERE Id = ?
-- PUT
	SELECT * FROM Topic WHERE Id = ? -- check if exists
	UPDATE Topic SET ? WHERE Id = ?
	-- used on update cascade; here if we dont want to use it
	-- UPDATE Video SET ? WHERE TopicId = ?
	-- UPDATE Exercise SET ? WHERE TopicId = ?
	-- UPDATE Document SET ? WHERE TopicId = ?
	-- UPDATE Progress SET ? WHERE TopicId = ?
-- DELETE
	DELETE FROM Topic WHERE Id = ?

-- ID/Activities
-- GET 
	SELECT * FROM Topic WHERE Id = ? -- check if exists
	SELECT * FROM ? WHERE TopicId = ?
-------------------------------------------------------------------------------
-- Exercise Management
-- GET
	SELECT * FROM Exercise
-- POST
	-- Check Duplicate
	SELECT * FROM Exercise WHERE TopicId = ? AND Name = ? AND Question = ?
	INSERT INTO Exercise SET ?

-- ID
-- GET
	SELECT * FROM Exercise WHERE Id = ?
-- PUT
	SELECT * FROM Exercise WHERE Id = ? -- check if exists
	UPDATE Exercise SET ? WHERE Id = ?
-- DELETE
	DELETE FROM Exercise WHERE Id = ?

-- ID/Grade
	SELECT * FROM Exercise WHERE Id = ? -- check if exists
	UPDATE Exercise SET ? WHERE Id = ?
-------------------------------------------------------------------------------
-- Video Management
-- GET
	SELECT * FROM Video
-- POST
	-- Check Duplicate
	SELECT * FROM Video WHERE Name = ? AND Link = ? -- check duplicate
	INSERT INTO Video SET ?

-- ID
-- GET
	SELECT * FROM Video WHERE Id = ?
-- PUT
	SELECT * FROM Video WHERE Id = ? -- check if exists
	UPDATE Video SET ? WHERE Id = ?
-- DELETEs
	DELETE FROM Video WHERE Id = ?
-------------------------------------------------------------------------------
-- Document Management
-- GET
	SELECT * FROM Document
-- POST
	-- Check Duplicate
	SELECT * FROM Document WHERE Name = ?
	INSERT INTO Document SET ?

-- ID
-- GET
	SELECT * FROM Document WHERE Id = ?
-- PUT
	SELECT * FROM Document WHERE Id = ? -- check if exists
	UPDATE Document SET ? WHERE Id = ?
-- DELETE
	DELETE FROM Document WHERE Id = ?
-------------------------------------------------------------------------------
-- Section Management
-- GET
	SELECT * FROM Section WHERE Term = ? -- filtered by term
	SELECT * FROM Section WHERE Name = ? -- filtered by name
	SELECT * FROM Section
-- POST
	SELECT * FROM Section WHERE Name = ? AND Term = ? -- check duplicate
	INSERT INTO Section SET ?

-- ID
-- GET
	SELECT * FROM Section WHERE Id = ?
-- PUT
	SELECT * FROM Section WHERE Id = ? -- check if exists
	UPDATE Section SET ? WHERE Id = ?
-- DELETE
	DELETE FROM Section WHERE Id = ?
-------------------------------------------------------------------------------
-- Progress Management
-- UserId
-- GET
	SELECT * FROM Progress WHERE UserId = ?
-- PUT
	SELECT * FROM Progress WHERE UserId = ? -- check if exists
	UPDATE Progress SET ? WHERE UserId = ?
-------------------------------------------------------------------------------
-- Enrollment Management
-- GET
	SELECT * FROM Enrollment WHERE UserId = ? -- filtered by userid
	SELECT * FROM Enrollment WHERE SectionId = ? -- filtered by sectionid
	SELECT * FROM Enrollment
-- POST
	-- check duplicate
	SELECT * FROM Enrollment WHERE UserId = ? AND SectionId = ?
	INSERT INTO Enrollment SET ?
-- DELETE
	DELETE FROM Enrollment WHERE UserId = ? AND SectionId = ?



