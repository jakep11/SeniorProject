const Express = require('express');
const router = Express.Router({caseSensitive: true});
const async = require('async');
const Tags = require('./Validator.js').Tags;

router.baseURL = '/Topic';

router.get('/', (req, res) => {
   const vld = req.validator;
   const sectionId = req.query.sectionId;
   const cnn = req.cnn;

   const where = sectionId ? `WHERE sectionId = ${sectionId}` : '';
   const query = `SELECT id, departmentId, name, sectionId FROM Topic ${where}`;

   async.waterfall([
      function validateAndQuery(cb) { // TODO: find out if we want all sections if no query
         if (isNaN(sectionId)) { // query sectionId is not a number
            res.status(400).end();
            cb(true);
         }
         else {
            cnn.chkQry(query, null, cb);
         }
      },

      function checkResults(topicResults, fields, cb) {
         if (vld.check(topicResults.length, Tags.notFound, null, cb)) {
            res.json(topicResults);
            cb(null);
         }
      }
   ], function(err) {
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
      
   ], function(err) {
      if (err) 
         res.json(err);
      
      cnn.release();
   });
});

router.get('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.get('/:id/Activities', (req, res) => {

});

module.exports = router;
