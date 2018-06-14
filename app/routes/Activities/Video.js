const Express = require('express');
const router = Express.Router({caseSensitive: true});
const async = require('async');
const Tags = require('../Validator.js').Tags;
const progress = require('./progressUpdate.js');

router.baseURL = '/Video';

router.get('/', (req, res) => {
   let vld = req.validator;
   const topicId = req.query.topicId;

   const where = topicId ? `WHERE topicId = ${topicId}` : '';
   const query = `SELECT * FROM Video ${where}`;


   async.waterfall([
      function(cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb))
            req.cnn.chkQry(query, null, cb);
      },
      function(videoList, fields, cb) {
         res.json(videoList);
         cb();
      }
   ], 
   function(err) {
      req.cnn.release();
   });
});

router.post('/', (req, res) => {
   let vld = req.validator;
   let body = req.body;
   let cnn = req.cnn;
   let vidFields = ['name', 'link', 'topicId', 'dueDate'];

   async.waterfall([
      function(cb) {
         if(vld.checkAdmin(cb) && 
            vld.hasFields(body, vidFields, cb) &&
            vld.hasOnlyFields(body, vidFields, cb) &&
            vld.chain(body.name, Tags.missingField, ['name'])
               .chain(body.link, Tags.missingField, ['link'])
               .chain(body.dueDate, Tags.missingField, ['dueDate'])
               .check(body.topicId, Tags.missingField, ['topicId'], cb)){
            cnn.chkQry('SELECT * FROM Video WHERE Name = ? AND Link = ?', 
               [body.name, body.link], cb);
         }
      },
      function(dupVids, fields, cb) {
         if(vld.check(!dupVids.length, Tags.dupVideoLink, null, cb)) {
            cnn.chkQry('INSERT INTO Video SET ?', body, cb);
         }
      },
      function(result, fields, cb) {
         res.location(router.baseURL + '/' + result.insertId).end();
         if(result.affectedRows) {
            progress.updateProgsInsert(cnn, "Video", body);
         }
         cb();
      }
   ],
   function(err) {
      cnn.release();
   });
});

router.get('/:id', (req, res) => {
   let vld = req.validator;

   async.waterfall([
   	function(cb) {
   		if (vld.check(req.session, Tags.noLogin, null, cb)) {
   			req.cnn.chkQry('Select * from Video where id = ?', 
   		 	 req.params.id, cb);
   		}
   	},
   	function(videoList, fields, cb) {
   		if(videoList.length){
   			res.json(videoList[0]);
   			cb();
   		} else {
   			res.status(404).end();
   			cb();
   		}
   	}
   ], 
   function(err) {
   	req.cnn.release();
   });
});

router.put('/:id', (req, res) => {
   let vld = req.validator;
   let cnn = req.cnn;
   let body = req.body;
   let id = req.params.id;

   async.waterfall([
      function(cb) {
         if(vld.checkAdmin(cb))
            cnn.chkQry('Select * from Video where id = ?', id, cb);
      },
      function(vidsList, fields, cb) {
         if(!vidsList.length) {
            res.status(404).end();
            cb();
         }
         else if(vld.hasOnlyFields(body, ['name','link', 'dueDate', 'topicId'], cb) &&
          (vld.check(body.name, Tags.missingField, ['name'], cb) || 
          vld.check(body.link, Tags.missingField, ['link'], cb))){
            cnn.chkQry('UPDATE Video SET ? WHERE Id = ?', [body, id], cb);
         }
      }, 
      function(result, fields, cb) {
         res.status(200).end();
         if(result.affectedRows && body.topicId) {
            progress.updateProgsUpdate(cnn, "Video", id, body.topicId);
         }
         cb();
      }
   ], function(err) {
      cnn.release();
   });
});

router.delete('/:id', (req, res) => {
   let vld = req.validator;
   let cnn = req.cnn;
   let id = req.params.id;

   async.waterfall([
   	function(cb) {
         if(vld.checkAdmin(cb)) {
            cnn.chkQry('Select * from Video where id = ?', id, cb);
         }
   	},
   	function(vidsList, fields, cb){
   		if(vidsList.length) {
   			cnn.chkQry('delete from Video where id = ?', id, cb);
   		} else {
   			res.status(404).end();
   			cb();
   		}
   	},
      function(delResult, fields, cb) {
         res.status(200).end();
         if(delResult.affectedRows) {
            progress.updateProgsDelete(cnn, "Video", id)
         }
         cb();
      }
   ], 
   function(err) {
   	req.cnn.release();
   });
});

module.exports = router;