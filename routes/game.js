var express = require('express');
var router = express.Router();
var debug = require('debug')('battleship:routes/game');
var app = require('../app.js');

// Handle GET to /game by creating a new game
router.get('/', function(req, res) {
  debug('GET');
  var board = req.app.locals.game;
  // if (typeof game.gameOn !== 'undefined' && !game.gameOn) {
  //   delete game;
  //   game = new Board(config);
  //   game.grid = game.populate();
  // } else {
  //   game = new Board(config);
  //   game.grid = game.populate();

  if (board.gameOn) {
    debug('gameOn '+ board.gameOn);
    board.reset(function() {
      board.grid = board.populate();
    });
  } else {
    board.populate();
  }

  res.json(board);
});

module.exports = router;
