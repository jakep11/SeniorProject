-- Insert Document
INSERT INTO Progress (activityType, userId, activityId, topicId) 
 SELECT 1, a.userId, d.id, a.topicId 
 FROM Document d JOIN 
  (SELECT e.userId, t.id as topicId, t.sectionId 
   FROM Enrollment e JOIN Topic t ON e.sectionId=t.sectionId) a 
    ON d.topicId = a.topicId;

-- Insert Exercise
INSERT INTO Progress (activityType, userId, activityId, topicId) 
 SELECT 2, a.userId, ex.id, a.topicId 
 FROM Exercise ex JOIN 
  (SELECT e.userId, t.id as topicId, t.sectionId 
   FROM Enrollment e JOIN Topic t ON e.sectionId=t.sectionId) a 
    ON ex.topicId = a.topicId;

-- Insert Video
INSERT INTO Progress (activityType, userId, activityId, topicId) 
 SELECT 3, a.userId, v.id, a.topicId 
 FROM Video v JOIN 
  (SELECT e.userId, t.id as topicId, t.sectionId 
   FROM Enrollment e JOIN Topic t ON e.sectionId=t.sectionId) a 
    ON v.topicId = a.topicId;

-- Updates
-- Document
Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3)
WHERE userId = 4 and activityType = 1 and 
 (activityId <= 7) or (activityId >= 21 and activityId <= 23);
Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3)
WHERE userId = 5 and activityType = 1 and 
 (activityId % 2 = 0);
 Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3) 
WHERE userId = 3 and activityType = 1 and 
 (activityId % 2 = 1);

Update Progress p Join Document d on d.id = p.activityId
SET p.whenCompleted = DATE_SUB(d.dueDate, INTERVAL RAND()*5 HOUR)
WHERE p.attempted = TRUE and activityType = 1;

-- Exercise
Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3) 
WHERE userId = 4 and activityType = 2 and 
 (activityId <= 7) or (activityId >= 21 and activityId <= 23);
Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3)
WHERE userId = 5 and activityType = 2 and 
 (activityId % 2 = 0);
 Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3)
WHERE userId = 3 and activityType = 2 and 
 (activityId % 2 = 1);

Update Progress p Join Exercise e on e.id = p.activityId
SET p.whenCompleted = DATE_SUB(e.dueDate, INTERVAL RAND()*5 HOUR)
WHERE p.attempted = TRUE and activityType = 2;

-- Video
Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3) 
WHERE userId = 4 and activityType = 3 and 
 (activityId <= 7) or (activityId >= 21 and activityId <= 23);
Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3) 
WHERE userId = 5 and activityType = 3 and 
 (activityId % 2 = 0);
Update Progress SET attempted = TRUE, grade = TRUNCATE(RAND(), 3)
WHERE userId = 3 and activityType = 3 and 
 (activityId % 2 = 1);

Update Progress p Join Video v on v.id = p.activityId
SET p.whenCompleted = DATE_SUB(v.dueDate, INTERVAL RAND()*5 HOUR)
WHERE p.attempted = TRUE and activityType = 3;