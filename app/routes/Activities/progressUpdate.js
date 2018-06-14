// var cnn = require('../CnnPool.js');
var async = require('async');

var progressUpdate = {

}

var getActivityId = function(cnn, activity, body, cbId){
   var activityId = -1;
	switch(activity.toUpperCase()) {
		case 'DOCUMENT':
			async.waterfall([
            function(cb) {
               var query = 'SELECT id FROM Document WHERE topicId = ? and ' +
               'name = ? and contentPath = ?';
               cnn.chkQry(query, [body.topicId, body.name, body.contentPath], cb);
            },
            function(documentId, fields, cb) {
               activityId = documentId[0].id;
               cbId(activityId);

            }], 
            function(err) {

            }
         );
         break;
		case 'EXERCISE':
         async.waterfall([
            function(cb) {
               var query = 'SELECT id FROM Exercise WHERE topicId = ? and ' +
               'question = ? and answer = ?';
               cnn.chkQry(query, [body.topicId, body.question, body.answer], cb);
            },
            function(exerciseId, fields, cb) {
               activityId = exerciseId[0].id;
               cbId(activityId);
            }], 
            function(err) {

            }
         );
         break;
		case 'VIDEO':
         async.waterfall([
            function(cb) {
               var query = 'SELECT id FROM Video WHERE topicId = ? and ' +
               'name = ? and link = ?';
               cnn.chkQry(query, [body.topicId, body.name, body.link], cb);
            },
            function(videoId, fields, cb) {
               activityId = videoId[0].id;
               cbId(activityId);
            }], 
            function(err) {

            }
         );
         break;
   }
      return activityId;
} 

var addDocumentToProgress = function(cnn, body) {
   async.waterfall([
      function(cb) {
         var query = 'SELECT id FROM Topic WHERE sectionId = ?';
         cnn.chkQry(query, [body.sectionId], cb);
      },
      function(topicList, fields, cb) {
         var ids = [] ;
         for(var i = 0; i < topicList.length; i++){
            ids.push(topicList[i].id);
         }

         cnn.chkQry('INSERT INTO Progress(userId, activityType, ' + 
          'activityId, topicId) SELECT ?, 1, id, topicId FROM Document ' + 
            'WHERE topicId in (?)', [body.userId, ids], cb);      
      }],
      function(err){

      }
   );
}

var addExerciseToProgress = function(cnn, body) {
   async.waterfall([
      function(cb) {
         var query = 'SELECT id FROM Topic WHERE sectionId = ?';
         cnn.chkQry(query, [body.sectionId], cb);
      },
      function(topicList, fields, cb) {
         var ids = [] ;
         for(var i = 0; i < topicList.length; i++){
            ids.push(topicList[i].id);
         }

         cnn.chkQry('INSERT INTO Progress(userId, activityType, ' + 
          'activityId, topicId) SELECT ?, 2, id, topicId FROM Exercise ' + 
            'WHERE topicId in (?)', [body.userId, ids], cb);      
      }],
      function(err){

      }
   );
}

var addVideoToProgress = function(cnn, body) {
   async.waterfall([
      function(cb) {
         var query = 'SELECT id FROM Topic WHERE sectionId = ?';
         cnn.chkQry(query, [body.sectionId], cb);
      },
      function(topicList, fields, cb) {
         var ids = [] ;
         for(var i = 0; i < topicList.length; i++){
            ids.push(topicList[i].id);
         }

         cnn.chkQry('INSERT INTO Progress(userId, activityType, ' + 
          'activityId, topicId) SELECT ?, 3, id, topicId FROM Video ' + 
            'WHERE topicId in (?)', [body.userId, ids], cb);      
      }],
      function(err){

      }
   );
}

progressUpdate.updateProgsEnrollment = function(cnn, body) {
   addDocumentToProgress(cnn, body);
   addExerciseToProgress(cnn, body);
   addVideoToProgress(cnn, body);
}

progressUpdate.updateProgsInsert = function (cnn, activity, body) {
	getActivityId(cnn, activity, body, function(activId) {
      var activityType = 0;
      switch(activity.toUpperCase()){
         case 'DOCUMENT':
            activityType = 1
            break;
         case 'EXERCISE':
            activityType = 2
            break;
         case 'VIDEO':
            activityType = 3
            break;      
      }

      async.waterfall([
         function(cb) {
            var query = 'INSERT INTO Progress(userId, activityType, ' + 
             'activityId, topicId) SELECT e.userId, ?, ?, ? ' + 
             'FROM Topic t JOIN Enrollment e ' +
             'ON t.sectionId = e.sectionId WHERE t.id = ?';
            cnn.chkQry(query, [activityType, activId, body.topicId, body.topicId], cb);
         }], 
         function(err) {

         }
      );
   })
}

progressUpdate.updateProgsUpdate = function (cnn, activity, activityId, topicId) {
   var activityType = 0;
   switch(activity.toUpperCase()){
      case 'DOCUMENT':
         activityType = 1
         break;
      case 'EXERCISE':
         activityType = 2
         break;
      case 'VIDEO':
         activityType = 3
         break;      
   }

   async.waterfall([
      function(cb) {
         var query = 'UPDATE Progress SET topicId = ? WHERE ' + 
         'activityType = ? and activityId = ?';
         cnn.chkQry(query, [topicId, activityType, activityId], cb);
      }], 
      function(err) {

      }
   );
}

progressUpdate.updateProgsDelete = function (cnn, activity, activityId) {
   var activityType = 0;
   switch(activity.toUpperCase()){
      case 'DOCUMENT':
         activityType = 1
         break;
      case 'EXERCISE':
         activityType = 2
         break;
      case 'VIDEO':
         activityType = 3
         break;      
   }

   async.waterfall([
      function(cb) {
         var query = 'DELETE FROM Progress WHERE ' + 
         'activityType = ? and activityId = ?';
         cnn.chkQry(query, [activityType, activityId], cb);
      }], 
      function(err) {

      }
   );
}

module.exports = progressUpdate;