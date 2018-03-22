
const Express = require('express');
const router = Express.Router({caseSensitive: true});

router.baseURL = '/Topic';


router.route('')

  .get((req, res) => {
    let where = req.query['sectionId'] ? `WHERE sectionId = ${req.query['sectionId']}` : '';
    let query = `SELECT id, departmentId, name, sectionId FROM Topic ${where}`;

    res.json();
  });


module.exports = router;
