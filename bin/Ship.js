//////////////////
// Ship object! //
//////////////////

var debug = require('debug')('battleship:routes/game');


/**
 * Constructor for a Ship object
 * @param {string} _type Named type of our boat, ex. 'submarine'
 */
function Ship(_type, _size) {
  this.type = _type;
  this.code = _type.charAt(0).toUpperCase();
  this.size = _size;
  this.health = _size[_type];
}

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
