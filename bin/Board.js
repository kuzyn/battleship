///////////////////
// Board object! //
///////////////////

var rotate = require('matrix-rotate');

/**
 * This object holds our board settings
 * @param {object} _config our passed config object containing size and fleet infos
 */
function Board(_config) {
  this.grid = this.initiate(_config.size);
  this.dirg = this.reverse(this.initiate(_config.size)); // This is a flipped matrix to check our vertical placements
  this.gridState = this.grid;
  this.matchState = true; // i.e. game state
  this.activeShips = _config.fleet;
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

module.exports = Board;
