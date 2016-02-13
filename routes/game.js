var express = require('express');
var router = express.Router();

/////////////////////////////////////////////////
// Handle GET to /game by creating a new game //
////////////////////////////////////////////////

router.get('/', function(req, res) {
  res.sendStatus(200);
});

module.exports = router;
