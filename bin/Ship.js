//////////////////
// Ship object! //
//////////////////

/**
 * Constructor for a Ship object
 * @param {string} _type Named type of our boat, ex. 'submarine'
 */
function Ship(_type) {
  this.type = _type;
  this.code = _type.charAt(0).toUpperCase();
  this.size = this.rules(_type);
  this.health = this.size;
  this.position = {
    "bow": [undefined, undefined],
    "stern": [undefined, undefined]
  };
}

/**
 * Return a Ship size
 * @type {object} _ship
 */
Ship.prototype.rules = function(_ship) {
  var size = {
    "carrier": 5,
    "battleship": 4,
    "submarine": 3,
    "destroyer": 3,
    "patrol_boat": 2
  };
  return size[_ship];
};

/**
 * Register a hit on our Ship
 * @return {[type]} [description]
 */
Ship.prototype.hit = function() {
  var self = this;
  if (!!self.health) {
    if (self.health > 1) {
      self.health--;
      return self.health;
    }
    self.health--;
    return self.health;
  }
  return 'X';
};

// Ship.prototype.place = function (_board) {
//   var self = this;
//   var flat = _.flatten(_board);
//   var cursor;
//
//   cursor = flat[getRandomInt(0, flat.length-self.size)]
//
//   self.position = {
//     "bow": [cursor, undefined],
//     "stern": [undefined, undefined]
//   };
//
//   // Tiny helper to get a random int
//   function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min)) + min;
//   }
//
// };




    // var self = this;
    // var grid;
    // var randomRow;
    // var cursor;
    // var placed = false;
    // var counter = 0;
    //
    // // random decide if we'll place a vertical (grid) or horizontal(dirg) boat
    // grid = !!getRandomInt(0, 1) ? _board.grid : _board.dirg;
    //
    // while (!placed) {
    //   randomRow = grid[getRandomInt(0, grid.length)];
    //
    //   _.forEach(randomRow, function(value) {
    //     if (!_.isString(value)) {
    //       counter++;
    //     }
    //   });
    //
    // }
    //



    //
    // // then we just random bruteforce the grid... inelegant but effective
    // while (!_.isSafeInteger(cursor) && !placed) {
    //   if (!_.isSafeInteger(cursor)) {
    //     cursor = grid[randomRow][getRandomInt(0, (randomRow.length)-self.size)];
    //   }
    //   if (!placed) {
    //
    //   }
    // }

    // randomTile = cursor;


module.exports = Ship;
