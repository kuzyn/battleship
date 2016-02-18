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
  var rawCoordinates = req.body.coordinates;
  var x = parseInt(req.body.coordinates[1]);
  var y = parseInt(req.body.coordinates[0]);
  var ship = getShipFromTile(board.activeShips, [x, y]);

  var response = {
    hit: true,
    message: '',
    coordinates: [y, x],
    rawCoordinates: rawCoordinates,
    type: '',
    ship: {}
  };

  if (!_.isEmpty(ship)) {
    response.ship = ship[0];
    response.type = ship[0].type;
    if (ship[0].hit()) {
      response.message = 'HIT';
      res.json(response);
      if (ship[0].size >= 4 && ship[0].health === 2) {
        response.message = 'HIT pleading survivors of the sinking';
        res.json(response);
      }
    } else {
      response.message = 'SANK';
      board.removeSunkenShip(ship[0]);
      res.json(response);
    }
  } else {
    response.hit = false;
    response.message = 'MISSED';
    res.json(response);
  }
});

function getShipFromTile(_activeShips, _tile) {
  return _.filter(_activeShips, function(obj) {
    return _.find(obj.tiles, function(arr) {
      return _.isEqual(arr, _tile) && obj;
    });
  });
}

module.exports = router;
