var express = require('express');
var router = express.Router();
var config = require('../config.js');

//////////////////////////////////////
// Handles POST to /fire with fire! //
//////////////////////////////////////

router.post('/', function(req, res) {
  res.sendStatus(200);
});

//////////////////////////////////////
// Handles GET to /fire with ????? //
//////////////////////////////////////

router.get('/', function(req, res) {
  res.sendStatus(200);
});

module.exports = router;
