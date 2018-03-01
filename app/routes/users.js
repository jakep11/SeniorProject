var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
   //Dummy Data for now
   res.json([{
      id: 1,
      username: 'jakep'
   }, {
      id: 2,
      username: 'bradys'
   }]);
});

module.exports = router;
