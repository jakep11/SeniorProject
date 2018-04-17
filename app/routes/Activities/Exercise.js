var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Exercise';

/* GET --
 * Returns all exercises. 
 * Exercises have id, name, question, type, points, topicId
 */
router.get('/', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   
   async.waterfall([
      function(cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('SELECT * FROM Exercise', cb);
      },
      function(exerciseArr, fields, cb) {
         if (vld.check(exerciseArr.length, Tags.notFound, null, cb)) {
            for (var exe in exerciseArr) {
               delete exe.answer;
            }
            res.json(exerciseArr);
            cb();
         }
      }
   ], function(err) {
      cnn.release();
   });
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
   var id = parseInt(req.session.id);
   
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
         cb();
      }
   ], function(err) {
      cnn.release();
   }); 
});

/* GET --
 * Returns the specified exercise.
 * ??? - Same returned properties as above GET?
 */
router.get('/:exerciseId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var exerciseId = req.params.exerciseId;
   
   async.waterfall([
      function(cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('SELECT * FROM Exercise WHERE Id = ?', [exerciseId], cb);
      },
      function(exerciseArr, fields, cb) {
         if (vld.check(exerciseArr.length, Tags.notFound, null, cb))
            delete exe.answer;
            
            res.json(exerciseArr);
            cb();
      }
   ], function(err) {
      cnn.release();
   });
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
         cnn.chkQuery('SELECT * FROM Exercise WHERE Id = ?', [exerciseId], cb);
      },
      function(exerciseArr, fields, cb) {
         if (vld.check(exerciseArr.length, Tags.notFound, null, cb) &&
            vld.checkAdmin(cb))
            cnn.chkQry('UPDATE Exercise SET ? WHERE Id = ?', 
               [body, exerciseId], cb);
      }
   ], function(err) {
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
         cnn.chkQuery('SELECT * FROM Exercise WHERE Id = ?', [exerciseId], cb);
      },
      function(exerciseArr, fields, cb) {
         if (vld.check(exerciseArr.length, Tags.notFound, null, cb) &&
            vld.checkAdmin(cb))
            cnn.chkQry('DELETE FROM Exercise WHERE Id = ?', [exerciseId], cb);
      }
   ], function (err) {
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
         cnn.chkQuery('SELECT * FROM Exercise WHERE Id = ?', [exerciseId], cb);
      },
      function(exerciseArr, fields, cb) {
         if (vld.check(exerciseArr.length, Tags.notFound, null, cb) &&
            vld.check(body.answer, Tags.missingValue, ["answer"], cb) &&
            vld.checkAdmin(cb))
            var correct = false;
            // Use trim to get rid of extra whitespace at end of answer string.
            if (body.answer.trim() === exerciseArr[0].answer.trim()) {
               correct = true;
            } 
            res.json({isCorrect : correct});
      }
   ], function(err) {
      cnn.release();
   });
});

module.exports = router;

