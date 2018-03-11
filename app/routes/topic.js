const Express = require('express');
const router = Express.Router({caseSensitive: true});
const async = require('async');
const Tags = require('./Validator.js').Tags;

router.baseURL = '/Topic';

router.get('/', (req, res) => {
   const sectionId = req.query.sectionId;
   const cnn = req.cnn;

   const where = sectionId ? `WHERE sectionId = ${sectionId}` : '';
   const query = `SELECT id, departmentId, name, sectionId FROM Topic ${where}`;

   async.waterfall([
      function validateAndQuery(cb) { 
         if (isNaN(sectionId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else {
            cnn.chkQry(query, null, cb);
         }
      },

      function checkResults(topicResults, fields, cb) {
         res.json(topicResults);
         cb(null);
      }

   ], function callback(err) {
      if (err) 
         res.json(err);
      
      cnn.release();
   });
});

router.post('/', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const body = req.body;

   const postTopicFields = ['name', 'sectionId'];
   const getSectionQuery = '';
   const insertTopicQuery = '';

   async.waterfall([
      function checkSectionExists(cb) { // validate input and check section exists
         if (vld.hasFields(body, postTopicFields, cb) && 
            vld.hasOnlyFields(body, postTopicFields, cb)) { // validate input

            cnn.chkQry(getSectionQuery, [body.sectionId], cb);
         }
      },

      function createTopic(sectionResults, fields, cb) { // insert topic into DB
         if (vld.check(sectionResults.length, Tags.notFound, null, cb)) {
            cnn.chkQry(insertTopicQuery, body, cb);
         }
      },

      function finalizeResponse(insertResult, fields, cb) { // finalize response
         res.location(router.baseURL + '/' + insertResult.insertId).end();
         cb(null);
      }
      
   ], function callback(err) {
      if (err) 
         res.json(err);
      
      cnn.release();
   });
});

router.get('/:id', (req, res) => {
   const cnn = req.cnn;
   const topicId = req.params.id;

   const getTopicQuery = '';

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else {
            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function finalizeResponse(topicResults, fields, cb) { // finalize response
         res.json(topicResults);
         cb(null);
      }
      
   ], function callback(err) {
      if (err) 
         res.json(err);
      
      cnn.release();
   });
});

router.put('/:id', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const body = req.body;
   const topicId = req.params.id;

   const putTopicFields = ['name', 'sectionId'];
   const getTopicQuery = '';
   const updateTopicQuery = '';

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else if (vld.checkAdmin(cb) &&
            vld.hasOnlyFields(body, putTopicFields, cb)) { // validate input

            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function updateTopic(topicResults, fields, cb) { // update topic in DB
         if (vld.check(topicResults.length, Tags.notFound, null, cb)) {
            cnn.chkQry(updateTopicQuery, body, cb);
         }
      },

      function finalizeResponse(updateResult, fields, cb) { // finalize response
         res.status(200).end();
         cb(null);
      }
      
   ], function callback(err) {
      if (err) 
         res.json(err);
      
      cnn.release();
   });
});

router.delete('/:id', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const topicId = req.params.id;

   const getTopicQuery = '';
   const deleteTopicQuery = '';

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else if (vld.checkAdmin(cb)) {
            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function deleteTopic(topicResults, fields, cb) { // delete topic from DB
         if (vld.check(topicResults.length, Tags.notFound, null, cb)) {
            cnn.chkQry(deleteTopicQuery, [topicId], cb);
         }
      },

      function finalizeResponse(deleteResult, fields, cb) { // finalize response
         res.status(200).end();
         cb(null);
      }
      
   ], function callback(err) {
      if (err) 
         res.json(err);
      
      cnn.release();
   });
});

router.get('/:id/Activities', (req, res) => {
   const vld = req.validator;
   const cnn = req.cnn;
   const topicId = req.params.id;

   const getTopicQuery = '';
   const getTopicActivitiesQuery = '';

   async.waterfall([
      function checkTopicExists(cb) { // validate input and check section exists
         if (isNaN(topicId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else if (vld.checkAdmin(cb)) {
            cnn.chkQry(getTopicQuery, [topicId], cb);
         }
      },

      function getTopicActivities(topicResults, fields, cb) { // get topic's activities from DB
         if (vld.check(topicResults.length, Tags.notFound, null, cb)) {
            cnn.chkQry(getTopicActivitiesQuery, [topicId], cb);
         }
      },

      function finalizeResponse(topicActivitiesResult, fields, cb) { // finalize response
         res.json(topicActivitiesResult);
         cb(null);
      }
      
   ], function callback(err) {
      if (err) 
         res.json(err);
      
      cnn.release();
   });
});

module.exports = router;
