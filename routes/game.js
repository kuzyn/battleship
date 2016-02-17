var express = require('express');
var router = express.Router();
var debug = require('debug')('battleship:routes/game');

// Handle GET to /game by creating a new game
router.get('/', function(req, res) {
  debug('GET');
  var board = req.app.locals.game;
  var executing = false;

  if (board.gameOn && !executing) {
    executing = true;
    debug('gameOn '+ board.gameOn);
    board.reset(function() {
      board.grid = board.populate();
      executing = false;
    });
  } else {
    board.grid = board.populate();
    executing = false;
  }

  res.json(board);
});

module.exports = router;
