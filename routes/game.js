var debug = require('debug')('battleship:routes/game');
var express = require('express');
var router = express.Router();

//////////////////
// Game routing //
//////////////////

// Handle GET to localhost:port/api/game by creating a new game
router.get('/', function(req, res) {
  debug('GET');

  var game = req.app.locals.game;
  var executing = false;

  // if a grid is already populated, reset it
  if (game.gameOn && !executing) {
    executing = true;
    game.reset(function () { // callback to populate after our grid has resetted
      game.grid = game.populate();
      executing = false;
    });
  } else {
    game.grid = game.populate();
    executing = false;
  }

  res.json(game);
});

module.exports = router;
