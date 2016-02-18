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
  this.tiles = [];
  this.health = _size[_type];
  this.destroyed = false;
}


Ship.prototype.setTiles = function (_coordinates) {
  this.tiles = _coordinates;
};

/**
 * Register a hit on our Ship
 * @return {[type]} [description]
 */
Ship.prototype.hit = function() {
  if (!!this.health) {
    if (this.health > 1) {
      this.health--;
      debug(this.type + ' hit');
      return true;
    }
    this.health--;
    debug(this.type + ' destroyed');
    this.destroyed = true;
    return false;
  }
  return null;
};

module.exports = Ship;
