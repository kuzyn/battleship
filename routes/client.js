var debug = require('debug')('battleship:routes/client');
var express = require('express');
var router = express.Router();

////////////////////
// Client routing //
////////////////////

// where we send our GET to localhost:port/
router.get('/', function(req, res) {
  debug('GET');

  res.render('client', req.locals);
});

module.exports = router;
