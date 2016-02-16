var express = require('express');
var router = express.Router();
var debug = require('debug')('battleship:routes/fire');


//////////////////////////////////////
// Handles POST to /fire with fire! //
//////////////////////////////////////

router.post('/', function(req, res) {
    debug('POST');
    res.sendStatus(200);
});

//////////////////////////////////////
// Handles GET to /fire with ?????  //
//////////////////////////////////////

router.get('/', function(req, res) {
    debug('GET');
    res.sendStatus(200);
});

module.exports = router;
