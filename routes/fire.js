var express = require('express');
var router = express.Router();
var _ = require('lodash');
var debug = require('debug')('battleship:routes/fire');


//////////////////////////////////////
// Handles POST to /fire with fire! //
//////////////////////////////////////

router.post('/', function(req, res) {
  debug('POST ' + JSON.stringify(req.body));

  var board = req.app.locals.game;
  var as = board.activeShips;
  var grid = board.grid;
  var x = parseInt(req.body.coordinates[1]);
  var y = parseInt(req.body.coordinates[0]);
  var tile = [x, y];
  var ship = _.filter(as, function(obj) {
    return _.find(obj.tiles, function(arr) {
      return _.isEqual(arr, tile) && obj;
    });
  });

  if (!_.isEmpty(ship) && grid[x][y] !== 'X') {
    ship[0].hit();
    res.json({
      hit: true,
      message: 'HIT',
      type: ship[0].type,
      coordinates: [x, y]
    });
  } else {
    res.json({
      hit: false,
      message: 'MISSED',
      type: '',
      coordinates: [x, y]
    });
  }
});

module.exports = router;
