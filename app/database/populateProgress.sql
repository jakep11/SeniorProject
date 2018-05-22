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
