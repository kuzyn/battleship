//////////////////
// Board class! //
//////////////////

var debug = require('debug')('battleship:Board');
var Ship = require('../bin/Ship.js');
var _ = require('lodash');


/**
 * Constructor for our Board
 * @param {object} config Our passed config object containing size and fleet infos
 */
function Board(config) {
  debug('New instance of ' + this.constructor.name);

  this._id = _.random(0, 9000);
  this._size = config.size; // 10
  this._fleet = config.fleet; // [{foo: 1, bar: 0}]
  this._activeFleet = _.clone(config.fleet);
  this._shipsLengths = config.shipsLengths; // [{foo: 1, bar: 0}]
  this._grid = this._initiate(this._size); // [][]
  this._gameOn = false; // playing = true;
  this._activeShips = []; // [{},{},{}]
  this._tilesWithShips = []; // [[],[],[]]
  this._hitTiles = [];
}


/**
 * Given coordinates, add them to an array that we can lookup
 * @param {[type]} coordinates [description]
 */
Board.prototype._setHitTiles = function (coordinates) {
  return this._hitTiles.push(coordinates);
};

/**
 * Remove ships from our active list (aka they were sunk)
 * @param  {string} type type of ship i.e. 'submarine'
 * @return {undefined}
 */
Board.prototype._removeActiveShip = function(type) {

  var fleet = this._activeFleet;

  _.each(fleet, function(value, key) {
    if (key === type) {
        fleet[key] = fleet[key] !== 0 ? fleet[key] -1 : fleet[key];
    }
  });

};

/**
 * Get a list of remaining active (not destroyed) ships
 * @return {object} The boats & numbers
 */
Board.prototype._getRemainingShips = function() {
  return this._activeFleet;
};

/**
 * Reset the grid by removing all ships & clearing the board
 * @param {function} callback Optional callback to execute after
 */
Board.prototype._reset = function(callback) {
  debug('reset');

  this._id = Math.floor(Math.random() * (9999 - 0)) + 0;
  this._activeShips = [];
  this._tilesWithShips = [];
  this._gameOn = false;
  this._grid = this._initiate(this._size);
  this._activeFleet = this._fleet;
  this._hitTiles = [];

  if (callback && _.isFunction(callback)) {
    callback();
  }

};


/**
 * Initialize our Board with empty (0) tiles
 * @param  {int} size Size of our grid
 * @return {array}    return a 2D array with each position numbered
 */
Board.prototype._initiate = function(size) {
  debug('initiate');

  var res = [];
  var row = [];

  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      row.push(0);
    }
    res.push(row);
    row = [];
  }

  return res;

};


/**
 * Populates our board & bruteforce our grid for collisions. This is the main event :)
 * @param  {object} _ships A list of our boats + their number
 * @return {array}        Returns a populated version of our grid
 */
Board.prototype._populate = function() {
  debug('populate');

  var populatedGrid = _.clone(this._grid); // once processed this will become our return object
  var allShipsLengths = _.clone(this._shipsLengths);
  var tilesWithShips = this._tilesWithShips;
  var activeShips = this._activeShips;
  var shipsRemaining = getShipList(_.clone(this._fleet)); // our list of ships to place
  var collisionsCounter = 0;

  // while our list of ships to place isn't empty
  while (!!shipsRemaining.length) {
    var placed = false;
    var horizontal = !!_.random(); // _.random default to 0,1

    // create our ship & assign its length
    var ship = new Ship(shipsRemaining.pop(), allShipsLengths);
    ship._size = getShipSize(ship._type, allShipsLengths);

    while (!placed) {
      var size = ship._size;
      var flatTWS = _.flatten(tilesWithShips); // flatten our tiles so we can search them better
      var max = populatedGrid.length - size; // make sure our boat stay within the board's edge
      var pos = [getRandomInt(0, max), getRandomInt(0, max)];
      var posEnd = horizontal ? [pos[0], pos[1] + size] : [pos[0] + size, pos[1]];
      var posBuffer = [];

      // pre-emptive check for collisions
      while (_.find(flatTWS, pos) || _.find(flatTWS, posEnd)) {
        pos = [getRandomInt(0, max), getRandomInt(0, max)];
        posEnd = horizontal ? [pos[0], pos[1] + size] : [pos[0] + size, pos[1]];
      }

      // save our positions into a buffer that we can test for collisions
      if (horizontal) {
        for (var i = pos[1] + 1; i <= posEnd[1]; i++) {
          posBuffer.push([pos[0], i]);
        }
      } else {
        for (var j = pos[0] + 1; j <= posEnd[0]; j++) {
          posBuffer.push([j, pos[1]]);
        }
      }

      // only push the buffer once we're sure that there is no collisions
      if (noCollisions(posBuffer, populatedGrid)) {
        for (var k = 0; k < posBuffer.length; k++) {
          var x = posBuffer[k][0];
          var y = posBuffer[k][1];
          populatedGrid[x][y] = ship._code;
        }

        tilesWithShips = horizontal ? tilesWithShips.reverse() : tilesWithShips;

        tilesWithShips.push(posBuffer);
        ship._setTiles(posBuffer);
        activeShips.push(ship);
        placed = true;

      } else {
        collisionsCounter++;
      }

      // error handling
      if (collisionsCounter > 300) {

        try {
          var err = new Error(collisionsCounter + ' try refreshing the page');
          throw err;
        } catch (err) {
          debug(err);
          break;
        }

      }

    } // while (!placed)
  } // while (!!shipsRemaining.length)

  // all of our ships are placed!
  debug('Grid solved in ' + collisionsCounter + ' passes');
  this._gameOn = true;
  return populatedGrid;


  /////////////
  // HELPERS //horizontal
  /////////////

  // From our position buffer and grid, return a boolean false if a tile already has a boat
  function noCollisions(buffer, grid) {
    var conflicts = 0;
    var pointer = [];

    for (var i = 0, z = buffer.length; i < z; i++) {
      pointer = [buffer[i][0], buffer[i][1]];
      conflicts += !_.isSafeInteger(grid[pointer[0]][pointer[1]]) ? 1 : 0;
    }

    return !conflicts;

  }

  // Given a list of ships to place, return their name in an array
  function getShipList(collection) {
    var remaining = [];

    _.forEach(collection, function(value, key) {
      for (var i = 0; i < value; i++) {
        remaining.push(key);
      }
    });

    return remaining;

  }

  // Given a ship type and size list, return the corresponding ship size
  function getShipSize(type, list) {
    return list[type];
  }

  // Given a min-max, return a random int
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

};

module.exports = Board;
