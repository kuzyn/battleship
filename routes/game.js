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
    "carrier": 2,
    "battleship": 0,
    "submarine": 0,
    "destroyer": 0,
    "patrol_ship": 0
  }
};

var boardInstance = new Board(config);

boardInstance.populate();
console.log(JSON.stringify(boardInstance.activeShips));

router.get('/', function(req, res) {
  // res.sendStatus(200);
  res.json(boardInstance.gridPopulated);
});

module.exports = router;
