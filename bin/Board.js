///////////////////
// Board object! //
///////////////////

var rotate = require('matrix-rotate');
var _ = require('lodash');
var Ship = require('../bin/Ship.js');
var debug = require('debug')('battleship:server');


/**
 * Constructor for our Board
 * @param {object} _config our passed config object containing size and fleet infos
 */
function Board(_config) {
  this.gridSize = _config.size;
  this.grid = this.initiate(this.gridSize);
  this.dirg = this.reverse(this.initiate(this.gridSize)); // This is a flipped matrix to do our vertical placements
  this.gridPopulated = this.populate(_config.fleet);
  this.matchState = true; // i.e. playing or winning
}


/**
 * Function to initilize our Board with numbered tiles
 * @param  {int} _size Size of our square (we will rotate the matrix so it needs to be square)
 * @return {array}    return a 2D array with each position numbered
 */
Board.prototype.initiate = function(_size) {
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
 * A helper to rotate our matrix
 * @param  {int} _grid Our square's size
 * @return {array}       A rotated version of our grid
 */
Board.prototype.reverse = function(_grid) {
  return rotate(_grid);
};


/**
 * This populates our board & randomly bruteforce our grid for collisions...inelegant but works & easy to refactor
 * @param  {object} _ships A list of our boats + their number
 * @return {array}        Returns a populated version of our grid
 */
Board.prototype.populate = function(_ships) {
  var self = this;
  var occupiedTiles = []; // register
  var shipsRemaining = getShipList(_ships); // our list of ships to place
  var populatedGrid = self.grid; // our return object
  var collisionstCounter = 0;

  while (!!shipsRemaining.length) {
    var placed = false; // our current ship status on the board
    var horizontal = decideOrientation();
    var matrix = horizontal ? self.grid : self.dirg; // grid = vertical align, dirg = horizontal align

    // Create our ship
    var ship = new Ship(shipsRemaining.pop());

    while (!placed) {
      var positionBuffer = [];
      var cursor = [getRandomInt(0, matrix.length - ship.size), getRandomInt(0, matrix.length - ship.size)];
      var cursorEnd = horizontal ? [cursor[0], cursor[1] + (ship.size) - 1] : [cursor[0] + (ship.size) - 1, cursor[1]];
      ship.position.bow = cursor;
      ship.position.stern = cursorEnd;

      // save our positions into a buffer that we can test for collision
      if (horizontal) {
        for (var i = cursor[1]; i < cursorEnd[1] + 1; i++) {
          positionBuffer.push([cursor[0],i]);
        }
      } else {
        for (var j = cursor[0]; j < cursorEnd[0] + 1; j++) {
          positionBuffer.push([j,cursor[1]]);
        }
      }

      // only register our boats positions when we find an arrangement without collisions
      if (noCollision(positionBuffer, populatedGrid)) {
        for (var k = 0; k < positionBuffer.length; k++) {
          var x = positionBuffer[k][0];
          var y = positionBuffer[k][1];
          populatedGrid[x][y] = ship.code;
        }
        occupiedTiles.push(positionBuffer);
        occupiedTiles = horizontal ? occupiedTiles.reverse() : occupiedTiles;
        placed = true;
      }

      // tiny bit of error handling
      if (collisionstCounter > 100) {
        debug('Too many collisions, try reducing the number of ships')
        process.exit(1);
        break;
      }

    }
  }

  debug('Grid solved in ' + collisionstCounter + ' passes');
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
      collisionstCounter++;
    }
    return !conflicts;
  }

  // Return a pseudo-randomly chosen boolean (true = horizontal)
  function decideOrientation() {
    return Math.random() < 0.5 ? true : false;
  }

  // Get a list of ships to place, return an array of ship name
  function getShipList(_shipsList) {
    var remaining = [];
    _.forEach(_shipsList, function(value, key) {
      for (var i = 0; i < value; i++) {
        remaining.push(key);
      }
    });
    return remaining;
  }

  // Return a random int
  function getRandomInt(_min, _max) {
    return Math.floor(Math.random() * (_max - _min)) + _min;
  }

};

module.exports = Board;
