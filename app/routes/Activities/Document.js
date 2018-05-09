var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Document';

/* GET --
 * Returns all documents. 
 * Documents have id, name, content, topicId, dueDate.
 */
router.get('/', function(req, res) {
   const vld = req.validator;
   const cnn = req.cnn;
   const sectionId = req.query.sectionId;

   const where = sectionId ? `WHERE sectionId = ${sectionId}` : '';
   const query = `SELECT * FROM Document ${where}`;

   async.waterfall([
      function(cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry(query, null, cb);
      },
      function(documentArr, fields, cb) {
         res.json(documentArr);
         cb();
      }
   ], function(err) {
      cnn.release();
   });
});

/* POST --
 * Creates a new document. Requires admin. 
 * Requires POST body to have name, content.
 */
router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var id = parseInt(req.session.id);
   
   async.waterfall([
      function(cb) {
         if (vld.checkAdmin(cb) &&
            vld.hasFields(body, ['name', 'content'], cb))
            cnn.chkQry('SELECT * FROM Document WHERE Name = ?', [body.name], cb); 
      },
      function(existingDoc, fields, cb) {
         if (vld.check(!existingDoc.length, Tags.dupExercise, null, cb)) {
            cnn.chkQry('insert into Document set ?', body, cb);
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
 * Returns the specified document.
 * Has same fields as above. 
 */
router.get('/:documentId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var documentId = req.params.documentId;
   
   async.waterfall([
      function(cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('SELECT * FROM Document WHERE Id = ?', [documentId], cb);
      },
      function(documentArr, fields, cb) {
         if (documentArr.length) {
            res.json(documentArr[0]);
            cb();
         }
         else {
            res.status(404).end();
            cb();
         }
      }
   ], function(err) {
      cnn.release();
   });
});

/* PUT -- 
 * Updates the specified exercise. 
 * Can update name, question, answer, type, points, topicId.
 */
router.put('/:documentId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var documentId = req.params.documentId;
   
   async.waterfall([
      function(cb) {
         cnn.chkQry('SELECT * FROM Document WHERE Id = ?', [documentId], cb);
      },
      function(documentArr, fields, cb) {
         if (vld.check(documentArr.length, Tags.notFound, null, cb) &&
            vld.checkAdmin(cb))
            cnn.chkQry('UPDATE Document SET ? WHERE Id = ?', 
               [body, documentId], cb);
      },
      function(putResult, fields, cb) {
         res.status(200).end();
         cb();
      }
   ], function(err) {
      cnn.release();
   });
});

/* DELETE --
 * Delete the specified document.
 */
router.delete('/:documentId', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var documentId = req.params.documentId;
   
   async.waterfall([
      function(cb) {
         if (vld.checkAdmin(cb)) {
            cnn.chkQry('SELECT * FROM Document WHERE Id = ?', [documentId], cb);
         }
      },
      function(documentArr, fields, cb) {
         if (documentArr.length) {
            cnn.chkQry('DELETE FROM Document WHERE Id = ?', [documentId], cb);
         }
         else {
            res.status(404).end();
            cb();
         }
      },
      function(delResult, fields, cb) {
         res.status(200).end();
         cb();
      }
   ], function (err) {
      cnn.release();
   });
});

module.exports = router;

