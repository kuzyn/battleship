var express = require('express');
var router = express.Router();
var Board = require('../bin/Board.js');
var debug = require('debug')('battleship:routes/game.js');



var config = {
  "size": 10, // only a square grid is allowed
  "fleet": {
    "carrier": 1,
    "battleship": 1,
    "submarine": 1,
    "destroyer": 2,
    "patrol_boat": 1
  }
};

// holder for our Board object
var game = {};

// Handle GET to /game by creating a new game
router.get('/', function(req, res) {
  if (typeof game.gameOn !== 'undefined' && !game.gameOn) {
    delete game;
    game = new Board(config);
    game.grid = game.populate();
  } else {
    game = new Board(config);
    game.grid = game.populate();
  }
  res.json(game);
});

module.exports = router;
