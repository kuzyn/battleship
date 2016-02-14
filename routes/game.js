var express = require('express');
var router = express.Router();
var Board = require('../bin/Board.js');
var Boat = require('../bin/Boat.js');

/////////////////////////////////////////////////
// Handle GET to /game by creating a new game //
////////////////////////////////////////////////

var config = {
  "columns": 10,
  "rows": 10,
  "fleet": {
    "battleship": 1
  }
};

var boardInstance = new Board(10, 10);

router.get('/', function(req, res) {
  // res.sendStatus(200);
  res.json(boardInstance);
});

module.exports = router;
