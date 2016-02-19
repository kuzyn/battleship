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
  if (game._gameOn && !executing) {

    executing = true;

    game._reset(function() { // callback to populate after our grid has resetted
      game._grid = game._populate();
      executing = false;
    });

  } else {
    game._grid = game._populate();
    executing = false;
  }

  res.json(game);

});

module.exports = router;
