var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var progress = require('./progressUpdate.js');

router.baseURL = '/Exercise';

/* GET --
 * Returns all exercises. 
 * Exercises have id, name, question, type, points, topicId
 */
router.get('/', function(req, res) {
   var cnn = req.cnn;

   const topicId = req.query.topicId;

   const where = topicId ? `WHERE topicId = ${topicId}` : '';
   const query = `SELECT id, name, question, type, points, topicId, dueDate FROM Exercise ${where}`;

   var handler = function (err, prsArr) {
      res.json(prsArr);
      req.cnn.release();
   };

   cnn.chkQry(query, null, handler);
});

/* POST --
 * Creates a new exercise. Requires admin. 
 * Requires POST body to have name, question, answer, type, points, topicId
 * ??? - Check for duplicate exercises (dupExercise tag), dueDate init. null?
 */
router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   
   async.waterfall([
      function(cb) {
         if (vld.checkAdmin(cb) &&
            vld.hasFields(body, ['name', 'question', 'answer', 'type', 'points', 'topicId'], cb))

            cnn.chkQry('SELECT * FROM Exercise WHERE TopicId = ? AND Name = ? AND Question = ?', 
               [body.topicId, body.name, body.question], cb); 
      },
      function(existingExe, fields, cb) {
         if (vld.check(!existingExe.length, Tags.dupExercise, null, cb)) {
            body.dueDate = null;
         
            cnn.chkQry('insert into Exercise set ?', body, cb);
         }  
      },
      function(insRes, fields, cb) {
         res.location(router.baseURL + '/' + insRes.insertId).end();
         if(insRes.affectedRows) {
            progress.updateProgsInsert(cnn, "Exercise", body);
         }
         cb();
      }
   ], function() {
      cnn.release();
   }); 
});

/* GET --
 * Returns the specified exercise.
 * ??? - Same returned properties as above GET?
 */
router.get('/:exerciseId', function(req, res) {
   var exerciseId = req.params.exerciseId;

   let handler = function(err, exerciseArray) {
      if (!exerciseArray.length)
         res.status(404).end(); 
      else
         res.json(exerciseArray);

      req.cnn.release();
   };

   req.cnn.chkQry('SELECT id, name, question, type, points, topicId, dueDate ' +
      'FROM Exercise WHERE id = ?', [exerciseId], handler);
});

/* PUT -- 
 * Updates the specified exercise. 
 * Can update name, question, answer, type, points, topicId.
 * ??? - How to determine if duplicate to reject change?  Also admin-only?
 */
router.put('/:exerciseId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var exerciseId = req.params.exerciseId;
   
   async.waterfall([
      function(cb) {
         if (vld.checkAdmin(cb))
            cnn.chkQry('SELECT * FROM Exercise WHERE id = ?', [exerciseId], cb);
      },
      function(exerciseArr, fields, cb) {
         if (exerciseArr.length)
            cnn.chkQry('UPDATE Exercise SET ? WHERE id = ?', 
               [body, exerciseId], cb);
         else {
            res.status(404).end();
            cnn.release();
            return;
         }
      }
   ], function(result, fields, cb) {
      res.status(200).end();
      if(result.affectedRows && body.topicId) {
         progress.updateProgsUpdate(cnn, "Exercise", exerciseId, body.topicId);
      }

      cnn.release();
   });
});

/* DELETE --
 * Delete the specified exercise.
 */
router.delete('/:exerciseId', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var exerciseId = req.params.exerciseId;
   
   async.waterfall([
      function(cb) {
         if (vld.checkAdmin(cb))
            cnn.chkQry('SELECT * FROM Exercise WHERE Id = ?', [exerciseId], cb);
      },
      function(exerciseArr, fields, cb) {
         if (exerciseArr.length)
            cnn.chkQry('DELETE FROM Exercise WHERE Id = ?', [exerciseId], cb);
         else {
            res.status(404).end();
            cnn.release();
            return;
         }
      }
   ], function (delResult, fields, cb) {
      res.status(200).end();
      if(delResult.affectedRows) {
            progress.updateProgsDelete(cnn, "Exercise", exerciseId)
      }
      cnn.release();
   });
});

/* PUT --
 * Grades an exercise. 
 * POST body requires answer. Response body reports result of grading.
 * Object with single boolean property isCorrect, 
 * indicating whether or not the submission is correct.
 */
router.put('/:exerciseId/Grade', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var exerciseId = req.params.exerciseId;
   
   async.waterfall([
      function(cb) {
         cnn.chkQry('SELECT * FROM Exercise WHERE Id = ?', [exerciseId], cb);
      },
      function(exerciseArr, fields, cb) {
         if (!exerciseArr.length) {
            res.status(404).end();
            cb();
         }
         else if (vld.check(body.answer, Tags.missingValue, ['answer'], cb)) {
            var correct = false;
            // Use trim to get rid of extra whitespace at end of answer string.
            if (body.answer.trim().toLowerCase() === exerciseArr[0].answer.trim().toLowerCase()) {
               correct = true;
            } 
            res.json({isCorrect : correct});
            cb();
         }
      }
   ], function() {
      cnn.release();
   });
});

module.exports = router;

