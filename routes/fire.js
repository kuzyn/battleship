var debug = require('debug')('battleship:routes/fire');
var _ = require('lodash');
var express = require('express');
var router = express.Router();


//////////////////
// Fire routing //
//////////////////

// Handle POST to localhost:port/api/fire&coordinates=[n,n] by creating a new game
router.post('/', function(req, res) {
  debug('POST ' + JSON.stringify(req.body));

  var game = req.app.locals.game;
  var hitTiles = game._hitTiles;
  var length = game._grid.length;
  var dirtyCoordinates = req.body.coordinates;
  var x = parseInt(req.body.coordinates[1]);
  var y = parseInt(req.body.coordinates[0]);
  var ship = getShipFromTile(game._activeShips, [x, y]);

  // our response json
  var response = {
    impact: undefined,
    message: '',
    coordinates: [y, x],
    dirtyCoordinates: dirtyCoordinates,
    type: '',
    remaining: game._getRemainingShips(),
    ship: {}
  };

  // if we hit the same tile again...
  if (hitBefore(hitTiles, [y, x])) {
    if (!_.isEmpty(ship)) {
      response.message = 'HIT pleading survivors of the sinking';
      res.json(response);

    } else {

      response.message = 'HIT the exact same spot as before';
      res.json(response);
    }

  } else { // never before hit
    response.impact = true;

    if (!_.isEmpty(ship)) { // if our tile contains a ship
      ship = ship[0];
      response.ship = ship;
      response.type = ship._type;

      if (ship._hit([x, y])) {
        response.message = 'HIT';
        res.json(response);

      } else {

        response.message = 'SANK';
        game._removeActiveShip(ship._type);
        res.json(response);
      }

    } else { // !_.isEmpty(ship)
      response.impact = false;

      if (x <= length && y <= length) {
        response.message = 'MISSED';
        res.json(response);

      } else {

        response.message = 'OUT OF THE WATER PARK';
        res.json(response);
      }

    }

    game._setHitTiles([y, x]);

  }

});

// Given an array of previously hit tiles & a tile, will try to find the latter in the former
function hitBefore(hitTiles, tile) {
  for (var i = 0; i < hitTiles.length; i++) {
    console.log(hitTiles[i]);
    if (_.isEqual(hitTiles[i], tile)) {
      return true;
    }
  }
  return false
}

// from an array of active ships object and a tile coordinate([x,y]), returns which ship stand on this tile
function getShipFromTile(activeShips, tile) {
  return _.filter(activeShips, function(obj) {
    return _.find(obj._tiles, function(arr) {
      return _.isEqual(arr, tile) && obj;
    });
  });
}

module.exports = router;
