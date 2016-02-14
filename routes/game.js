var express = require('express');
var router = express.Router();

/////////////////////////////////////////////////
// Handle GET to /game by creating a new game //
////////////////////////////////////////////////

var config = {
  "columns": 10,
  "rows": 10,
  "fleet": {
    "battleship": 1
  }
};

var rules = {
  "size": {
    "carrier": 5,
    "battleship": 4,
    "submarine": 3,
    "destroyer": 3,
    "patrol_boat": 2
  }
};

var board = {
  "grid": initiateGrid(config)
};

router.get('/', function(req, res) {
  // res.sendStatus(200);
  res.json(board);
});

function initiateGrid (_conf) {
  var res = [];
  var row = [];
  for (var x = 0; x < _conf.columns; x++) {
    for (var y = 0; y < _conf.rows; y++) {
      row.push((x+1)*(y+1));
    }
    res.push(row);
    row = [];
  }
  return res;
}

module.exports = router;
