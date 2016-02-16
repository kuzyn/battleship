//////////////////
// Ship object! //
//////////////////

var debug = require('debug')('battleship:routes/game');


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
  if (!!this.health) {
    if (this.health > 1) {
      this.health--;
      debug(this.type + 'hit');
      return this.health;
    }
    this.health--;
    debug(this.type + 'destroyed');
    return this.health;
  }
  return 'X';
};

module.exports = Ship;
