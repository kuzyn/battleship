function Board(_xSize, _ySize) {
  this.grid = this.initiate(_xSize, _ySize);
}

Board.prototype.initiate = function initiateGrid (_x, _y) {
  var res = [];
  var row = [];
  for (var x = 0, xz = _x; x < xz; x++) {
    for (var y = 0, yz = _y; y < yz; y++) {
      row.push(0);
    }
    res.push(row);
    row = [];
  }
  return res;
};

module.exports = Board;
