const express = require('express');
const router = express.Router();

const topicRoutes = require('./topic.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/Topic', topicRoutes);


module.exports = router;


