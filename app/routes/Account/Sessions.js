var Express = require('express');
var bcrypt = require('bcrypt');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({ caseSensitive: true });

router.baseURL = '/Session';

router.get('/', function (req, res) {
   var body = [], ssn;

   if (req.validator.checkAdmin()) {
      for (var cookie in ssnUtil.sessions) {
         ssn = ssnUtil.sessions[cookie];
         body.push({ cookie: cookie, userId: ssn.id, loginTime: ssn.loginTime });
      }
      res.status(200).json(body);

   }
   req.cnn.release();
});

router.post('/', function (req, res) {
   var cookie;
   var cnn = req.cnn;

   cnn.query('select * from User where email = ?', [req.body.email],
      function (err, result) {
         if (req.validator.check(result.length && 
          bcrypt.compareSync(req.body.password, result[0].passHash),
          Tags.badLogin)) {
            cookie = ssnUtil.makeSession(result[0], res);
            res.location(router.baseURL + '/' + cookie).status(200).end();
         }

      });
   cnn.release();
});

router.delete('/:cookie', function (req, res) {
   if (req.session.isAdmin() || req.validator.check(req.params.cookie ===
      req.cookies[ssnUtil.cookieName], Tags.noPermission)) {
      ssnUtil.deleteSession(req.params.cookie);
      res.status(200).end();
   }
   req.cnn.release();
});

router.get('/:cookie', function (req, res) {
   var cookie = req.params.cookie;
   var vld = req.validator;

   if (ssnUtil.sessions[cookie] &&
      vld.checkPrsOK(ssnUtil.sessions[cookie].id)) {
      var session = ssnUtil.sessions[cookie];
      res.json({
         userId: session.id,
         cookie: cookie,
         loginTime: session.loginTime

      });
   }
   else if (vld.check(ssnUtil.sessions[cookie], Tags.notFound)) {
      // 
   }
   req.cnn.release();
});

module.exports = router;
