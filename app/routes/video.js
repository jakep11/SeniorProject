const Express = require('express');
const router = Express.Router({caseSensitive: true});
const async = require('async');
const Tags = require('./Validator.js').Tags;

router.baseURL = '/Video';

router.get('/', (req, res) => {
   let vld = req.validator;
   async.waterfall([
   	function(cb) {
   		if (vld.check(req.session, Tags.noLogin, null, cb))
   			req.cnn.chkQry("Select * from Video", null, cb);
   	},
   	function(videoList, fields, cb) {
   		if(vld.check(videoList.length, Tags.notFound, null, cb)){
   			res.json(videoList);
   			cb();
   		}
   	}
   ], 
   function(err) {
   	req.cnn.release();
   })
});

router.post('/', (req, res) => {
	let vld = req.validator;
	let body = req.body;
	let cnn = req.cnn;
	let vidFields = ['name', 'link', 'topicid']

	async.waterfall([
		function(cb) {
			if(vld.checkAdmin(cb) && 
			 vld.hasFields(body, vidFields, cb) &&
			 vld.hasOnlyFields(body, vidFields, cb) &&
			 vld.chain(body.name, Tags.missingField, ["name"])
			 .chain(body.link, Tags.missingField, ["link"])
			 .check(body.topicid, Tags.missingField, ["topicid"], cb)){
				cnn.chkQry("SELECT * FROM Video WHERE Name = ? AND Link = ?", 
				 [body.name, body.link], cb);
			}
		},
		function(dupVids, fields, cb) {
			if(vld.check(!dupVids.length, Tags.dupVideoLink, null, cb)) {
				cnn.chkQry("INSERT INTO Video SET ?", body, cb);
			}
		},
		function(result, fields, cb) {
			res.location(router.baseURL + '/' + result.insertId).end();
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
   			req.cnn.chkQry("Select * from Video where id = ?", 
   		 	 req.params.id, cb);
   		}
   	},
   	function(videoList, fields, cb) {
   		if(vld.check(videoList.length, Tags.notFound, null, cb)){
   			res.json(videoList);
   			cb();
   		}
   	}
   ], 
   function(err) {
   	req.cnn.release();
   })
});

router.put('/:id', (req, res) => {
	let vld = req.validator;
	let cnn = req.cnn;
	let body = req.body;
	let id = req.params.id;

	async.waterfall([
		function(cb) {
			cnn.chkQry("Select * from Video where id = ?", id, cb);
		},
		function(vidsList, fields, cb) {
			if(vld.check(vidsList.length, Tags.notFound, null, cb) &&
			 vld.checkAdmin(cb)){
				cnn.chkQry("UPDATE Video SET ? WHERE Id = ?", [body, id], cb);
			}
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
			cnn.chkQry("Select * from Video where id = ?", id, cb);
   	},
   	function(vidsList, fields, cb){
   		if(vld.checkAdmin(cb) && 
   		 vld.check(vidsList.length, Tags.notFound, null, cb)){
   			cnn.chkQry("delete from Video where id = ?", id, cb);
   		}
   	}
   ], 
   function(err) {
   	req.cnn.release();
   })
});

module.exports = router;