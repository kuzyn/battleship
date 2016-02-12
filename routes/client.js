var express = require('express');
var router = express.Router();

//////////////////////
// Handle GET to /  //
//////////////////////

router.get('/', function(req, res) {
  // res.sendStatus(200)
  res.render('client', req.locals);
});

module.exports = router;
