///////////////////
// Board object! //
///////////////////

var rotate = require('matrix-rotate');
var _ = require('lodash');
var Ship = require('../bin/Ship.js');
var debug = require('debug')('battleship:Board');


/**
 * Constructor for our Board
 * @param {object} _config our passed config object containing size and fleet infos
 */
function Board(_config) {
  this.id = Math.floor(Math.random() * (9999 - 0)) + 0;
  this.size = _config.size;
  this.ships = _config.fleet;
  this.gridPristine = this.initiate(this.size, 'gridPristine');
  this.grid = this.initiate(this.size, 'grid');
  this.dirg = rotate(this.initiate(this.size, 'dirg')); // This is a flipped matrix to do our vertical placements
  this.gameOn = false; // playing = true;
  this.activeShips = [];
  this.tilesWithShips = [];
  this.shipsLengths = _config.boat_length;
}


/**
 * Reset the grid by removing all ships & clearing the board
 * @param {function} _cb Optional callback to execute after
 */
Board.prototype.reset = function(_cb) {
  debug('reset');

  this.id = Math.floor(Math.random() * (9999 - 0)) + 0;
  this.gridPristine = this.initiate(this.size);
  this.activeShips = [];
  this.tilesWithShips = [];
  this.gameOn = false;
  this.grid = this.gridPristine;

  if (_cb && _.isFunction(_cb)) {
    _cb();
  }

};


/**
 * Initilize our Board with numbered tiles
 * @param  {int} _size Size of our square (we will rotate the matrix so it needs to be square)
 * @return {array}    return a 2D array with each position numbered
 */
Board.prototype.initiate = function(_size, _caller) {
  debug('initiate '+ _caller);
  var res = [];
  var row = [];
  var counter = 0;
  for (var x = 0, xz = _size; x < xz; x++) {
    for (var y = 0, yz = _size; y < yz; y++) {
      counter++;
      row.push(counter);
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
Board.prototype.populate = function() {
  debug('populate');
  var occupiedTiles = this.tilesWithShips; // register
  var shipsRemaining = getShipList(this.ships); // our list of ships to place
  var populatedGrid = this.grid; // our return object
  var shipsCollection = this.activeShips;
  var collisionsCounter = 0;

  while (!!shipsRemaining.length) {
    var placed = false; // our current ship status on the board
    var horizontal = decideOrientation();
    var matrix = horizontal ? this.grid : this.dirg; // grid = vertical align, dirg = horizontal align

    // Create our ship & assign its length
    var ship = new Ship(shipsRemaining.pop(), this.shipsLengths);
    ship.size = getShipSize(ship.type, this.shipsLengths);

    while (!placed && !this.gameOn) {
      var size = ship.size;
      var max = matrix.length - size; // make sure our boat stay within the board's edge
      var pos = [getRandomInt(0, max), getRandomInt(0, max)];
      var posEnd = horizontal ? [pos[0], pos[1] + size - 1] : [pos[0] + size - 1, pos[1]];
      var posBuffer = [];
      var flatten = _.flatten(occupiedTiles); // flatten our tiles so we can search them better

      // pre-emptive check for collisions
      while (_.find(flatten, pos) || _.find(flatten, posEnd)) {
        pos = [getRandomInt(0, max), getRandomInt(0, max)];
        posEnd = horizontal ? [pos[0], pos[1] + size - 1] : [pos[0] + size - 1, pos[1]];
      }

      // save our positions into a buffer that we can test for collisions
      if (horizontal) {
        for (var i = pos[1]; i < posEnd[1] + 1; i++) {
          posBuffer.push([pos[0], i]);
        }
      } else {
        for (var j = pos[0]; j < posEnd[0] + 1; j++) {
          posBuffer.push([j, pos[1]]);
        }
      }

      // only register our boats positions when we find an arrangement without collisions
      if (noCollision(posBuffer, populatedGrid)) {
        for (var k = 0; k < posBuffer.length; k++) {
          var x = posBuffer[k][0];
          var y = posBuffer[k][1];
          populatedGrid[x][y] = ship.code;
        }
        occupiedTiles.push(posBuffer);
        occupiedTiles = horizontal ? occupiedTiles.reverse() : occupiedTiles;
        shipsCollection.push(ship);
        ship.position.bow = pos;
        ship.position.stern = posEnd;
        placed = true;
      } else {
        collisionsCounter++;
      }

      // error handling (now throwing a new Error object to keep execution going)
      if (collisionsCounter > 200) {
        try {
          var err = new Error(collisionsCounter + ' collisions, try reducing the number of ships or refreshing the page');
          throw err;
        } catch (err) {
          debug(err);
          break;
        }
      }
    }
  } // while (!!shipsRemaining.length)

  // all of our ships are placed
  debug('Grid solved in ' + collisionsCounter + ' passes');
  this.gameOn = true;
  return populatedGrid;


  /////////////
  // HELPERS //
  /////////////

  // Get our position buffer and validate each tile, return a boolean false if a tile already has a boat
  function noCollision(_buffer, _matrix) {
    var conflicts = 0;
    var pointer = [];
    for (var i = 0; i < _buffer.length; i++) {
      pointer = [_buffer[i][0], _buffer[i][1]];
      conflicts += !_.isSafeInteger(_matrix[pointer[0]][pointer[1]]) ? 1 : 0;
    }
    return !conflicts;
  }

  // Return a pseudo-randomly chosen boolean (true = horizontal)
  function decideOrientation() {
    return Math.random() < 0.5 ? true : false;
  }

  // Given a list of ships to place, return their name in an array
  function getShipList(_shipsList) {
    var ships = _shipsList;
    var remaining = [];
    _.forEach(ships, function(value, key) {
      for (var i = 0; i < value; i++) {
        remaining.push(key);
      }
    });
    return remaining;
  }

  // Given a ship type and size list, return the ship size
  function getShipSize(_type, _sizeList) {
    return _sizeList[_type];
  }

  // Given a min-max, return a random int
  function getRandomInt(_min, _max) {
    return Math.floor(Math.random() * (_max - _min)) + _min;
  }

};

module.exports = Board;
