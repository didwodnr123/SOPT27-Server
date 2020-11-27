var express = require('express');
var router = express.Router();

router.use('/society', require('./society'));
router.use('/ranking', require('./ranking'));

router.use('/members', require('./members'));
router.use('/users', require('./users'));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
