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
  var length = game.grid.length;
  var dirtyCoordinates = req.body.coordinates;
  var x = parseInt(req.body.coordinates[1]);
  var y = parseInt(req.body.coordinates[0]);
  var ship = getShipFromTile(game.activeShips, [x, y]);

  // our response json
  var response = {
    hit: true,
    message: '',
    coordinates: [y, x],
    dirtyCoordinates: dirtyCoordinates,
    type: '',
    ship: {}
  };

  // if our tile contains a ship
  if (!_.isEmpty(ship)) {
    response.ship = ship[0];
    response.type = ship[0].type;
    if (ship[0].hit()) { //
      response.message = 'HIT';
      res.json(response);
      // if (ship[0].size >= 4 && ship[0].health === 2) {
      //   response.message = 'HIT pleading survivors of the sinking';
      //   res.json(response);
      // }
    } else {
      response.message = 'SANK';
      // game.removeSunkenShip(ship[0]);
      res.json(response);
    }
  } else {
    if (x <= length && y <= length) {
      response.hit = false;
      response.message = 'MISSED';
      res.json(response);
    } else {
      response.hit = false;
      response.message = 'OUT OF THE WATER PARK';
      res.json(response);
    }
  }
});

// from an array of active ships object and a tile coordinate([x,y]), returns which ship stand on this tile
function getShipFromTile(activeShips, tile) {
  return _.filter(activeShips, function(obj) {
    return _.find(obj.tiles, function(arr) {
      return _.isEqual(arr, tile) && obj;
    });
  });
}

module.exports = router;
