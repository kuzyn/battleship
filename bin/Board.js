var rotate = require('matrix-rotate');

function Board(_config) {
  this.grid = this.initiate(_config.columns, _config.rows);
  this.dirg = this.reverse(this.initiate(_config.columns, _config.rows));
  this.gridState = this.grid;
  this.status = undefined;
}

Board.prototype.initiate = function(_x, _y) {
  var res = [];
  var row = [];
  var counter = 0;
  for (var x = 0, xz = _x; x < xz; x++) {
    for (var y = 0, yz = _y; y < yz; y++) {
      counter++;
      row.push(counter);
    }
    res.push(row);
    row = [];
  }
  return res;
};

Board.prototype.reverse = function(_grid) {
  var dirg = rotate(_grid);
  return dirg;
};

module.exports = Board;
