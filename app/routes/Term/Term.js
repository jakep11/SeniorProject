var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Term';

/* GET --
 * Returns all terms. 
 * Terms have fields name, id.
 */
router.get('/', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   
   async.waterfall([
      function(cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('SELECT term, id FROM Section', cb);
      },
      function(termArr, fields, cb) {
         if (vld.check(documentArr.length, Tags.notFound, null, cb)) {
            res.json(termArr);
            cb();
         }
      }
   ], function(err) {
      cnn.release();
   });
});

/* POST --
 * Post a new term. Expects one field name. Requires admin.
 */
router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var id = parseInt(req.session.id);
   
   async.waterfall([
      
   ], function(err) {
      cnn.release();
   }); 
});


module.exports = router;

