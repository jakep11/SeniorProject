const Express = require('express');
const router = Express.Router({ caseSensitive: true });
const Tags = require('./Validator.js').Tags;
const async = require('async');

router.baseURL = '/Progress';

/* GET --
 * Returns the specified progress.
 * Returns fields userId, activityType, activityId, topicId, grade, attempted. 
 */
router.get('/:userId', function (req, res) {
   let vld = req.validator;
   let body = req.body;
   let cnn = req.cnn;
   let userId = req.params.userId;

   async.waterfall([
      function (cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb)) {
            cnn.chkQry('SELECT * FROM User WHERE id = ?', [userId], cb);
         }
      },
      function (userArr, fields, cb) {
         if (userArr.length) {
            cnn.chkQry('SELECT * FROM Progress WHERE userId = ?', [userId], cb);
         }
         else {
            res.status(404).end();
            cb();
         }
      },
      function (progressArr, fields, cb) {
         res.json(progressArr);
         cb();
      }
   ], function (err) {
      cnn.release();
   });
});

/* PUT -- 
 * Updates the specified exercise. 
 * Can update name, question, answer, type, points, topicId.
 */
router.put('/:userId', function (req, res) {
   let vld = req.validator;
   let body = req.body;
   let cnn = req.cnn;
   let userId = req.params.userId;
   let vldFields = ['activityId', 'activityType', 'grade']

   async.waterfall([
      function (cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb)) {
            cnn.chkQry('SELECT * FROM User WHERE id = ?', [userId], cb);
         }
      },
      function (userArr, fields, cb) { // Check that the userId is valid
         if (userArr.length) {
            let actT = body.activityType;
            if (vld.hasOnlyFields(body, vldFields, cb) &&
               vld.chain(body.activityId, Tags.missingField, ['activityId'])
                  .chain(body.activityType, Tags.missingField, ['activityType'])
                  .chain(typeof(body.grade) !== 'undefined', Tags.missingField, ['grade'])
                  .chain(body.grade >= 0, Tags.badValue, ['grade'])
                  .chain(body.activityId > 0, Tags.badValue, ['activityId'])
                  .check(actT === 1 || actT === 2 || actT === 3, Tags.badValue, ['activityType'], cb)) {
                     body.attempted = true;
                     body.whenCompleted = body.grade !== 0 ? new Date() : null;
                     cnn.chkQry('UPDATE Progress SET ? WHERE activityType = ? AND activityId = ? AND userId = ?', [body, body.activityType, body.activityId, userId], cb);
            }
         }
         else {
            res.status(404).end();
            cb();
         }
      },
      function (putResult, fields, cb) {
         res.status(200).end();
         cb();
      }
   ], function (err) {
      cnn.release();
   });
});

module.exports = router;

