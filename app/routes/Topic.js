const Express = require('express');
const router = Express.Router({caseSensitive: true});
const async = require('async');
const Tags = require('./Validator.js').Tags;

router.baseURL = '/Topic';

router.get('/', (req, res) => {
   const sectionId = req.query.sectionId;
   const cnn = req.cnn;
   const isLoggedIn = req.session;
   const vld = req.validator;

   const where = sectionId ? `WHERE sectionId = ${sectionId}` : '';
   const query = `SELECT * FROM Topic ${where}`;

   async.waterfall([
      function validateAndQuery(cb) { 
         if (vld.check(isLoggedIn, Tags.noLogin, null, cb))
            cnn.chkQry(query, null, cb);
      },
      function checkResults(topicResults, fields, cb) {
         res.json(topicResults);
         cb();
      }
   ], 
   function callback(err) {
      cnn.release();
   });
});

router.post('/', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const body = req.body;
   const sectionId = parseInt(body.sectionId);

   const postTopicFields = ['name', 'sectionId'];
   let getSectionQuery = 'SELECT * FROM Section WHERE id = ?';
   let getTopicQuery = 'SELECT * FROM Topic WHERE SectionId = ? and Name = ?';
   let insertTopicQuery = 'INSERT INTO Topic SET ?';

   async.waterfall([
      function checkSectionExists(cb) { // validate input and check section exists
         if (vld.checkAdmin(cb) &&
            vld.hasOnlyFields(body, postTopicFields, cb) &&
            vld.chain(body.name, Tags.missingField, ['name']) // should hasFields check for falsey?
               .check(body.sectionId, Tags.missingField, ['sectionId'], cb)) { // validate input

            cnn.chkQry(getSectionQuery, [sectionId], cb);
         }
      },

      function checkTopicDuplicate(sectionResults, fields, cb) {
         if (vld.check(sectionResults.length, Tags.notFound, null, cb)) {
            cnn.chkQry(getTopicQuery, [sectionId, body.name], cb);
         }
      },

      function createTopic(topicResults, fields, cb) { // insert topic into DB
         if (vld.check(!topicResults.length, Tags.notFound, null, cb)) {
            cnn.chkQry(insertTopicQuery, body, cb);
         }
      },

      function finalizeResponse(insertResult, fields, cb) { // finalize response
         res.location(router.baseURL + '/' + insertResult.insertId).end();
         cb();
      }
      
   ], 
   function callback(err) {
      cnn.release();
   });
});

router.get('/:id', (req, res) => {
   const cnn = req.cnn;
   const topicId = req.params.id;
   const vld = req.validator;
   const isLoggedIn = req.session;

   const getTopicQuery = 'SELECT * FROM Topic WHERE Id = ?';

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb();
         }
         else if (vld.check(isLoggedIn, Tags.noLogin, null, cb)) { // is logged in
            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function finalizeResponse(topicResults, fields, cb) { // finalize response
         if (topicResults.length) {// topic exists
            res.json(topicResults[0]);
         }
         else {
            res.status(404).end();
         }
         cb();
      }
   ], 
   function callback(err) {
      cnn.release();
   });
});

router.put('/:id', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const body = req.body;
   const topicId = req.params.id;

   const putTopicFields = ['name', 'sectionId'];
   const getTopicQuery = 'SELECT * FROM Topic WHERE Id = ?';
   const updateTopicQuery = 'UPDATE Topic SET ? WHERE Id = ?';

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else if (vld.checkAdmin(cb) &&
            vld.hasOnlyFields(body, putTopicFields, cb) &&
            vld.chain(!('name' in body) || body.name, Tags.missingField, ['name'])
               .check(!('sectionId' in body) || body.sectionId, 
                  Tags.missingField, ['sectionId'], cb)) { // validate input

            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function updateTopic(topicResults, fields, cb) { // update topic in DB
         if (topicResults.length) {// topic exists
            cnn.chkQry(updateTopicQuery, [body, topicId], cb);
         }
         else {
            res.status(404).end();
            return;
         }
      },

      function finalizeResponse(updateResult, fields, cb) { // finalize response
         res.status(200).end();
         cb(null);
      }
      
   ], 
   function callback(err) {
      cnn.release();
   });
});

router.delete('/:id', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const topicId = req.params.id;

   const getTopicQuery = 'SELECT * FROM Topic WHERE Id = ?';
   const deleteTopicQuery = 'DELETE FROM Topic WHERE Id = ?';

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb();
         }
         else if (vld.checkAdmin(cb)) { // is admin
            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function deleteTopic(topicResults, fields, cb) { // delete topic from DB
         if (topicResults.length) {
            cnn.chkQry(deleteTopicQuery, [topicId], cb);
         }
         else {
            res.status(404).end();
            cnn.release();
            return;
         }
      },

      function finalizeResponse(deleteResult, fields, cb) { // finalize response
         res.status(200).end();
         cb(null);
      }
      
   ], 
   function callback(err) {
      cnn.release();
   });
});

router.get('/:id/Activities', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const topicId = req.params.id;
   const isLoggedIn = req.session;

   const getTopicQuery = 'SELECT * FROM Topic WHERE Id = ?';
   const getExercisesQuery = 'SELECT * FROM Exercise WHERE TopicId = ?';
   const getVideosQuery = 'SELECT * FROM Video WHERE TopicId = ?';
   const getDocumentsQuery = 'SELECT * FROM Document WHERE TopicId = ?';

   let activitiesResult = {};

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else if (vld.check(isLoggedIn, Tags.noLogin, null, cb)) { // check for login
            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function getExercises(topicsResult, fields, cb) { // get topic's activities from DB
         if (topicsResult.length) { // topic exists
            cnn.chkQry(getExercisesQuery, [topicId], cb);
         }
         else {
            res.status(404).end();
            return;
         }
      },

      function getVideos(exercisesResult, fields, cb) {
         activitiesResult.exercises = exercisesResult;
         cnn.chkQry(getVideosQuery, [topicId], cb);
      },

      function getDocuments(videosResult, fields, cb) {
         activitiesResult.videos = videosResult;
         cnn.chkQry(getDocumentsQuery, [topicId], cb);
      },

      function finalizeResponse(documentsResult, fields, cb) { // finalize response
         activitiesResult.documents = documentsResult;
         res.json(activitiesResult);
         cb(null);
      }
      
   ], 
   function callback(err) {
      cnn.release();
   });
});

module.exports = router;