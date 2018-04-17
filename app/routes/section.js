const Express = require('express');
const router = Express.Router({caseSensitive: true});
const async = require('async');
const Tags = require('./Validator.js').Tags;

router.baseURL = '/Section';

router.get('/', (req, res) => {
	let term = req.query.term;
	let name = req.query.name;
	let vld = req.validator;
	let cnn = req.cnn;

	let where = term ? `WHERE term = ${term}` : (
		name ? `WHERE name = ${name}` : '')

	async.waterfall([
		function(cb){
			if (vld.check(req.session, Tags.noLogin, null, cb))
				cnn.chkQry(`SELECT * FROM Section ${where}`, null, cb);
		},
		function(secResult, fields, cb){
			if(vld.check(secResult.length, Tags.notFound, null, cb)){
				res.json(secResult);
				cb();
			}
		}
	], 
	function(err){
		cnn.release();
	});
});

router.post('/', (req, res) => {
	let vld = req.validator;
	let cnn = req.cnn;
	let body = req.body;
	let vldFields = ['name', 'description', 'term'];

	async.waterfall([
		function(cb){
			if(vld.checkAdmin(cb)){
				cnn.chkQry("SELECT * FROM Section WHERE name = ? and term = ?", [body.name, body.term], cb)
			}
		},
		function(secResult, fields, cb){
			if(vld.check(!secResult.length, Tags.dupSection, null, cb) &&
			 vld.hasFields(body, vldFields,cb) && 
			 vld.hasOnlyFields(body, vldFields, cb) &&
			 vld.chain(body.name, Tags.missingField, ["name"])
			 .chain(body.description, Tags.missingField, ["description"])
			 .check(body.term, Tags.missingField, ["term"], cb)) {
				cnn.chkQry("INSERT INTO Section SET ?", [body], cb);
			}
		},
		function(result, fields, cb) {
			res.location(router.baseURL + '/' + result.insertId).end();
			cb();
		}
	], 
	function(err){
		cnn.release();
	});
});

router.get('/:id', (req,res) => {
	let id = req.params.id;
	let vld = req.validator;
	let cnn = req.cnn;

	async.waterfall([
		function(cb){
			if(vld.check(req.session, Tags.noLogin, null, cb))
				cnn.chkQry('SELECT * FROM Section WHERE id = ?', [id], cb);
		},
		function(secResult, fields, cb){
			if(secResult.length){
				res.json(secResult);
				cb();
			} else {
				res.status(404).end();
				cb();
			}
		}
	],
	function(err) {
		cnn.release();
	});
});

router.put('/:id', (req, res) => {
	let id = re.params.id;
	let vld = req.validator;
	let cnn = req.cnn;
	let body = req.body;
	let vldfields = ['name', 'description', 'term'];

	async.waterfall([
		function(cb){
			if(vld.checkAdmin(cb))
				cnn.chkQry('SELECT * FROM Section WHERE id = ?', [id], cb);
		},
		function(secResult, fieldas, cb) {
			if(!secResult.length) {
				res.status(404).end();
				cb();
			} else if (vld.hasOnlyFields(body, vldfields, cb)) {
				cnn.chkQry("UPDATE Section SET ? WHERE id = ?", [body, id], cb);
			}
		}
	],
	function(err){
		cnn.release();
	});
});

router.delete('/:id', (req, res) => {
	let id = req.params.id;
	let vld = req.validator;
	let cnn = req.cnn;

	async.waterfall([
		function(cb){
			if(vld.checkAdmin(cb)){
				cnn.chkQry('SELECT * FROM Section WHERE Id = ?',[id], cb);
			}
		},
		function(secResult, fields, cb) {
			if(secResult.length){
				cnn.chkQry('DELETE FROM Section WHERE Id = ?', [id], cb);
			} else {
				res.status(404).end();
				cb();
			}
		}
	],
	function(err){
		cnn.release();
	});
});

module.exports = router;