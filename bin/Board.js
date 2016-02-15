///////////////////
// Board object! //
///////////////////

var rotate = require('matrix-rotate');
var _ = require('lodash');
var Ship = require('../bin/Ship.js');

/**
 * Constructor for our Board
 * @param {object} _config our passed config object containing size and fleet infos
 */
function Board(_config) {
  this.grid = this.initiate(_config.size);
  this.dirg = this.reverse(this.initiate(_config.size)); // This is a flipped matrix to check our vertical placements
  this.gridPopulated = this.populate(this.initiate(_config.size));
  this.matchState = true; // i.e. playing or winning
  this.activeShips = this.populate(_config.fleet);
}

/**
 * Function to initiate our Board
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


///////////////////
// REFACTOR THIS //
///////////////////

Board.prototype.populate = function(_ships) {
  var self = this;
  var occupiedTiles = [];
  var shipsRemaining = getShipList();
  var returnGrid = self.grid;

  while (!!shipsRemaining.length) {
    var placed = false;
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

      if (horizontal) {
        for (var i = cursor[1]; i < cursorEnd[1] + 1; i++) {
          positionBuffer.push([cursor[0],i]);
        }
      } else {
        for (var j = cursor[0]; j < cursorEnd[0] + 1; j++) {
          positionBuffer.push([j,cursor[1]]);
        }
      }

      if (noCollision(positionBuffer, returnGrid)) {
        for (var k = 0; k < positionBuffer.length; k++) {
          var x = positionBuffer[k][0];
          var y = positionBuffer[k][1];
          returnGrid[x][y] = ship.code;
        }
        occupiedTiles.push(positionBuffer);
        occupiedTiles = horizontal ? occupiedTiles.reverse() : occupiedTiles;
        placed = true;
      }
    }
    // console.log(occupiedTiles);
  }

  return returnGrid;

  // Helper to check for already placed boats
  function noCollision(_buffer, _matrix) {
    var conflicts = 0;
    var pointer = [];
    for (var i = 0; i < _buffer.length; i++) {
      pointer = [_buffer[i][0], _buffer[i][1]];
      conflicts += !_.isSafeInteger(_matrix[pointer[0]][pointer[1]]) ? 1 : 0;
    }
    console.log('conflicts:', conflicts);
    return !conflicts;
  }

  function decideOrientation() {
    return Math.random() < 0.5 ? true : false;
  }

  // Helper to get a list of ships to place
  function getShipList() {
    var remaining = [];
    _.forEach(_ships, function(value, key) {
      for (var i = 0; i < value; i++) {
        remaining.push(key);
      }
    });
    return remaining;
  }

  // Tiny helper to get a random int
  function getRandomInt(_min, _max) {
    return Math.floor(Math.random() * (_max - _min)) + _min;
  }

};

module.exports = Board;
