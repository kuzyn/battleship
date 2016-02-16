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
  this.size = _config.size;
  this.ships = _config.fleet;
  this.gridPristine = this.initiate(this.size);
  this.grid = this.initiate(this.size);
  this.dirg = this.reverse(this.initiate(this.size)); // This is a flipped matrix to do our vertical placements
  this.gameOn = false; // playing = true;
  this.activeShips = [];
  this.tilesWithShips = [];
}


/**
 * Reset the grid by removing all ships & clearing the board
 * @param {function} _cb Optional callback to execute after
 */
Board.prototype.reset = function(_cb) {
  debug('reset');

  this.activeShips = [];
  this.tilesWithShips = [];
  this.gameOn = false;
  this.grid = this.gridPristine;

  if (_cb && _.isFunction(_cb)) {
    setTimeout(function() {
      _cb();
    }, 200);
  }

};


/**
 * Function to initilize our Board with numbered tiles
 * @param  {int} _size Size of our square (we will rotate the matrix so it needs to be square)
 * @return {array}    return a 2D array with each position numbered
 */
Board.prototype.initiate = function(_size) {
  debug('initiate');
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

    // Create our ship
    var ship = new Ship(shipsRemaining.pop());

    while (!placed && !this.gameOn) {
      var size = ship.size; // size of our ship
      var max = matrix.length - size; // make sure our boat stays within the board's edge
      var pos = [];
      var posEnd = [];
      var posBuffer = [];

      // while (pos === posEnd || _.find(_.flatten(occupiedTiles, pos)) || _.find(_.flatten(occupiedTiles, posEnd))) {
        pos = [getRandomInt(0, max), getRandomInt(0, max)];
        posEnd = horizontal ? [pos[0], pos[1] + size - 1] : [pos[0] + size - 1, pos[1]];
        posBuffer = [];
        ship.position.bow = pos;
        ship.position.stern = posEnd;
      // }

      // save our positions into a buffer that we can test for collisions
      if (horizontal) {
        for (var i = pos[1]; i < posEnd[1] + 1; i++) {
          posBuffer.push([pos[0],i]);
        }
      } else {
        for (var j = pos[0]; j < posEnd[0] + 1; j++) {
          posBuffer.push([j,pos[1]]);
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
        placed = true;
      } else {
        collisionsCounter++;
      }

      // tiny bit of error handling
      if (collisionsCounter > 2000) {
        var err = new Error(collisionsCounter + ' collisions, try reducing the number of ships or refreshing the page');
        throw err;
      }

    }
  }

  // meat
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

  // Get a list of ships to place, return an array of ship name
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

  // Return a random int
  function getRandomInt(_min, _max) {
    return Math.floor(Math.random() * (_max - _min)) + _min;
  }

};

module.exports = Board;
