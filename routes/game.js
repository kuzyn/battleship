var express = require('express');
var router = express.Router();
var Board = require('../bin/Board.js');
var Ship = require('../bin/Ship.js');

/////////////////////////////////////////////////
// Handle GET to /game by creating a new game //
////////////////////////////////////////////////

var config = {
  "size": 10, // only a square grid is allowed (see Board.js)
  "fleet": {
    "battleship": 1
  }
};

var boardInstance = new Board(config);

router.get('/', function(req, res) {
  // res.sendStatus(200);
  res.json(boardInstance.grid);
});

module.exports = router;
