var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.baseURL = '/Prss';

router.get('/', function(req, res) {
   var reqEmail = req.query.email; 
   var au = req.session.id;

   var handler = function(err, prsArr) {
      res.json(prsArr);
      req.cnn.release();
   };

   if (reqEmail && req.session.isAdmin()) {
      req.cnn.chkQry('select id, email from Person where email like' +
      ' concat(?, "%")', [reqEmail], handler);
   }
   else if (reqEmail && !req.session.isAdmin()) {
      req.cnn.chkQry('select id, email from Person where (id = ? and email' +
      ' like concat(?, "%"))', [au, reqEmail], handler);
   }
   else if (!reqEmail && req.session.isAdmin()) {
      req.cnn.chkQry('select id, email from Person', handler);
   }
   else { //No request email and not an admin
      req.cnn.chkQry('select id, email from Person where id = ?', [au],
       handler);
   }
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password)
      body.password = "*";                       // Blocking password
   body.whenRegistered = new Date();

   async.waterfall([
   function(cb) { // Check properties and search for Email duplicates
      if (vld.hasFields(body, ["email", "lastName", "password", "role"], cb) &&
       vld.chain(body.password && body.password.length > 0, Tags.missingField,
       ["password"])
       .chain(body.role === 0 || admin, Tags.noPermission)
       .chain(body.termsAccepted || admin, Tags.noTerms)
       .check(!isNaN(body.role) && body.role >= 0 && body.role <= 1, 
       Tags.badValue, ["role"], cb)) {

         cnn.chkQry('select * from Person where email = ?', body.email, cb);
      }
   },
   function(existingPrss, fields, cb) {  // If no duplicates, insert new Person
      if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
         body.termsAccepted = body.termsAccepted && new Date();
         cnn.chkQry('insert into Person set ?', body, cb);
      }
   },
   function(result, fields, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result.insertId).end();
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkPrsOK(req.params.id)) {
      req.cnn.query('select id, firstName, lastName, email,' +
      ' UNIX_TIMESTAMP(whenRegistered) * 1000 as whenRegistered,' +
      'UNIX_TIMESTAMP(termsAccepted) * 1000 as termsAccepted,' +
      ' role from Person where id = ?', [req.params.id],
      function(err, prsArr) {
         if (vld.check(prsArr.length, Tags.notFound))
            res.json(prsArr);

         req.cnn.release();
      });
   }
   else {
      req.cnn.release();
   }
});

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var admin = req.session.isAdmin();
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      if (vld.check(!body.role || admin, Tags.badValue, ["role"], cb) &&
       vld.checkPrsOK(req.params.id, cb) &&
       vld.chain(!body.role || admin, Tags.noPermission)
       .chain(!(body.role < 0), Tags.badValue, ["role"])

       .chain(!(body.hasOwnProperty("id")), Tags.forbiddenField, ["id"])
       .chain(!(body.hasOwnProperty("email")), Tags.forbiddenField, ["email"])
       .chain(!(body.hasOwnProperty("termsAccepted")),
       Tags.forbiddenField, ["termsAccepted"])
       .chain(!(body.hasOwnProperty("whenRegistered")), 
       Tags.forbiddenField, ["whenRegistered"])
       
       .check((!body.password && body.password !== "") || body.oldPassword 
       || admin, Tags.noOldPwd, null, cb) 
       && vld.check(!body.hasOwnProperty("password") || 
       body.password.length > 0, Tags.badValue, ["password"], cb)){

         cnn.chkQry("select * from Person where id = ? ", [req.params.id], cb);
      } 
   },
   function(qRes, fields, cb) {
      if (vld.check(admin || !body.password || qRes[0].password === 
       body.oldPassword, Tags.oldPwdMismatch, null, cb)) {
         delete req.body.oldPassword;
         cnn.chkQry("update Person set ? where id = ?", [req.body, 
          req.params.id], cb);
       }
    },
    function(updRes, field, cb) {
       res.status(200).end();
       cb();
   }],
   function(err) {
      cnn.release();
   });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;
   if (vld.checkAdmin()) {
      req.cnn.query('DELETE from Person where id = ?', [req.params.id],
      function (err, result) {
         if (!err && vld.check(result.affectedRows, Tags.notFound))
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
