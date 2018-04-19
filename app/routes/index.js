const express = require('express');
const router = express.Router();

const topicRoutes = require('./Topic.js');


/* GET home page. */
router.get('/', function (req, res) {
   res.render('index', { title: 'Express' });
});

router.use('/Topic', topicRoutes);


module.exports = router;


