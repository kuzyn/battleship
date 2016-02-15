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

Board.prototype.populate = function(_ships) {
  var self = this;
  var grid = [];
  var occupiedTiles = [];
  var shipsRemaining = getShipList();
  var inService = [];
  var ship = {};
  var cursor = [];
  var cursorEnd = [];
  var returnGrid = self.grid;

  while (!!shipsRemaining.length) {
    var placed = false;
    var random = Math.random();
    var horizontal = random < 0.5 ? true : false;
    ship = new Ship(shipsRemaining.pop());

    while (!placed) {
      var tempCursor;
      grid = horizontal ? self.grid : self.dirg; // grid = vertical align, dirg = horizontal align
      cursor = [getRandomInt(0, grid.length), getRandomInt(0, grid.length-ship.size)];
      cursorEnd = horizontal ? [cursor[0], cursor[1]+(ship.size-1)] : [cursor[0]+(ship.size-1), cursor[1]];
      ship.position.bow = cursor;
      ship.position.stern = cursorEnd;

      if (horizontal) {
        for (var i = 0; i < ship.size; i++) {
          tempCursor = [cursor[0], cursorEnd[1]-i];
          returnGrid[cursor[0]][cursorEnd[1]-i] = ship.code;
          occupiedTiles.push(tempCursor);
        }
      } else {
        for (var y = 0; y < ship.size; y++) {
          tempCursor = [cursor[0]+y, cursorEnd[1]];
          returnGrid[cursor[0]+y][cursorEnd[1]] = ship.code;
          occupiedTiles.push(tempCursor);
        }
      }

      occupiedTiles = horizontal ? occupiedTiles.reverse(): occupiedTiles;

      placed = true;
    }

    inService.push(ship);
  }

  return returnGrid;

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
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

};

module.exports = Board;
