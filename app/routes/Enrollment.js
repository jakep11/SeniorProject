const Express = require('express');
const router = Express.Router({caseSensitive: true});
const async = require('async');
const Tags = require('./Validator.js').Tags;
const progress = require('./Activities/progressUpdate.js');

router.baseURL = '/Enrollment';

router.get('/', (req, res) => {
   let au = req.session.id;
   let admin = req.session && req.session.isAdmin();
   let userId = req.query.userId || !admin && au;
   let sectionId = req.query.sectionId;
   let vld = req.validator;

   let queryVars = [];
   let where;

   if (userId || !admin && au) {
      queryVars.push(userId);
      where = 'WHERE userId = ?';
      if (sectionId) {
         queryVars.push(sectionId);
         where += ' and sectionId = ?';
      }
   }
   else if (sectionId) {
      queryVars.push(sectionId);
      where = 'WHERE sectionId = ?';
   }

   let handler = function (err, enrollmentArray) {
      if (admin || vld.checkPrsOK(userId))
         res.json(enrollmentArray);

      req.cnn.release();
   };

   if (userId || sectionId)
      req.cnn.chkQry('select * from Enrollment ' + where, queryVars, handler);
   else
      req.cnn.chkQry('select * from Enrollment', handler);
});

router.post('/', (req, res) => {
   let vld = req.validator;
   let cnn = req.cnn;
   let body = req.body;
   let vldFields = ['userId', 'sectionId'];

   async.waterfall([
      function(cb) { // Check that the userId is valid
         if (vld.hasOnlyFields(body, vldFields, cb) &&
            vld.chain(body.userId, Tags.missingField, ['userId'])
               .check(body.sectionId, Tags.missingField, ['sectionId'], cb) && 
            vld.checkPrsOK(body.userId, cb)) {
            cnn.chkQry('SELECT * FROM User WHERE id = ?', body.userId, cb);
         }
      },
      function(result, fields, cb) { // Check that sectionId is valid
         if (vld.check(result.length, Tags.badValue, ['userId'], cb)) {
            cnn.chkQry('SELECT * FROM Section WHERE id = ?', body.sectionId, cb);
         }
      },
      function(result, fields, cb) { // Check for duplicate enrollment
         if(vld.check(result.length, Tags.badValue, ['sectionId'], cb)) {
            cnn.chkQry('SELECT * FROM Enrollment WHERE userId = ? and sectionId = ?', [body.userId, body.sectionId], cb);
         }
      },
      function(enrlResult, fields, cb) {
         if(vld.check(!enrlResult.length, Tags.dupEnrollment, null, cb) &&
          vld.hasFields(body, vldFields,cb) &&
          vld.chain(body.userId, Tags.missingField, ['userId'])
             .chain(body.sectionId, Tags.missingField, ['sectionId'], cb)) {
            cnn.chkQry('INSERT INTO Enrollment SET ?', [body], cb);
         }
      },
      function(result, fields, cb) {
         res.location(router.baseURL + '/' + result.insertId).end();
         if(result.affectedRows) {
            progress.updateProgsEnrollment(cnn, body);
         }
         cb();
      }
   ], 
   function() {
      cnn.release();
   });
});

router.delete('/:sectionId/:userId', (req, res) => {
   let sectionId = req.params.sectionId;
   let userId = req.params.userId;
   let vld = req.validator;

   if (vld.checkPrsOK(userId)) {
      req.cnn.query('DELETE from Enrollment where sectionId = ? and userId = ?', [sectionId, userId],
         function (err, result) {
            if (!err && !result.affectedRows)
               res.status(404).end();
            else if (!err)
               res.status(200).end();

            req.cnn.release();
         });
   }
   else {
      res.status(403).end();
      req.cnn.release();
   }
});

module.exports = router;