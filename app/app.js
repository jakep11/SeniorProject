var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
var Session = require('./routes/Session.js');
var Validator = require('./routes/Validator.js');
var CnnPool = require('./routes/CnnPool.js');

var async = require('async');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//For Production, need to copy contents of client build folder into public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   console.log("Handling " + req.path + '/' + req.method);
   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Headers", "Location, Content-Type, Authorization, Accept, X-HTTP-Method-Override, X-Requested-With");
   res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS');
   res.header("Access-Control-Expose-Headers", 'Location');
   res.header("Access-Control-Allow-Request-Headers", 'Location');


   if (req.method === 'OPTIONS')
      res.sendStatus(200);
   else
      next();
});


// Set up Session on req if available
app.use(Session.router);

app.get('/', function (req, res) {
   console.log("Home page");
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });

 app.get('/login', function (req, res) {
   console.log("Login page");
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });

// Check general login.  If OK, add Validator to |req| and continue processing,
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function (req, res, next) {
   console.log("Req.path: ", req.path);
   if (req.session || (req.method === 'POST' &&
      (req.path === '/api/User' || req.path === '/api/Session'))) {
      console.log("JAKE");
      req.validator = new Validator(req, res);
      next();
   } 
   else
      res.status(401).end();
});

app.use(CnnPool.router);

// I think I can get rid of this
//app.use('/', index);

// Load all subroutes
app.use('/api/User', require('./routes/Account/User'));
app.use('/api/Session', require('./routes/Account/Sessions'));
app.use('/api/Document', require('./routes/Activities/Document'));
app.use('/api/Exercise', require('./routes/Activities/Exercise'));
app.use('/api/Video', require('./routes/Activities/Video'));
app.use('/api/Section', require('./routes/Section'));
app.use('/api/Topic', require('./routes/Topic'));
app.use('/api/Enrollment', require('./routes/Enrollment'));
app.use('/api/Progress', require('./routes/Progress'));



// Special debugging route for /DB DELETE.  Clears all table contents, resets 
// all auto_increment keys to start at 1, and reinserts one admin user.
app.delete('/api/DB', function(req, res) {

   // Callbacks to clear tables
   var cbs = ["Document", "Enrollment", "Exercise", "Progress", "Section", "Topic", "User", "Video"].map(function(tblName) {
      return function(cb) {
         req.cnn.query("delete from " + tblName, cb);
      };
   });

   // Callbacks to reset increment bases
   cbs = cbs.concat(["Document", "Enrollment", "Exercise", "Progress", "Section", "Topic", "User", "Video"]
    .map(function(tblName) {
      return function(cb) {
         req.cnn.query("alter table " + tblName + " auto_increment = 1", cb);
      };
   }));

   // Callback to reinsert admin user
   cbs.push(function(cb) {
      req.cnn.query('INSERT INTO User (firstName, lastName, email,' +
       ' passHash, termsAccepted, role) VALUES ' +
       '("Joe", "Admin", "admin@example.com",' +
       '"$2a$10$Nq2f5SyrbQL2R0e9E.cU2OSjqqORgnwwsY1vBvVhV.SGlfzpfYvyi", NOW(), 1);', cb);
   });

   // Callback to clear sessions, release connection and return result
   cbs.push(function(callback){
      for (var session in Session.sessions)
         delete Session.sessions[session];
      callback();
   });

   if (!req.session.isAdmin()) {
      res.status(403).end();
   }
   else {
      async.series(cbs, function(err, status) {
      
      if (err)
         res.status(400).json(err);
      else
         res.status(200).end();
      });
      
   }
   req.cnn.release();
});

// Gets any routes that don't match 
app.get('/*', function (req, res) {
   console.log("CLIENT SIDE PATH");
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   console.log("JAKE SHOULD BE 404");
   res.render('index', { title: 'Express' });
   // var err = new Error('Not Found');
   // err.status = 404;
   // next(err);
});


// error handler
app.use(function (err, req, res) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

app.listen(process.env.PORT || 80, () => console.log(`App listening on port ${process.env.PORT || 80}`));

module.exports = app;