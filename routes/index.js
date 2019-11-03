var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/detail/:idx', function(req, res, next) {
  res.render('detail', { idx: req.params.idx });
});

router.get('/all', function(req, res, next) {
  res.render('allList');
});
module.exports = router;
