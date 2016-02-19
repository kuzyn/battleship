/////////////////
// Ship class! //
/////////////////

var debug = require('debug')('battleship:routes/game');


/**
 * Constructor for a Ship object
 * @param {string} type Named type of our boat, ex. 'submarine'
 * @param {integer} size Size of this ship
 */
function Ship(type, size) {
  // debug('New instance of ' + this.constructor.name + ' ('+type+')');

  this._type = type; // ex. 'submarine'
  this._code = type.charAt(0).toUpperCase(); // 'S'
  this._size = size; // 3
  this._tiles = []; // [[0,5], [1,5], [2,5]]
  this._health = size[type]; // 3
  this._destroyed = false; //false
}


/**
 * Set our object's tiles array (the tiles the ship occupies)
 * @param {[type]} coordinates An array of tiles
 */
Ship.prototype._setTiles = function (coordinates) {
  // debug('setTiles');

  this._tiles = coordinates;
};


/**
 * Register a hit on our Ship
 * @return {boolean} Return true on hit, false on sink and null on 'death ship'
 */
Ship.prototype._hit = function() {
  // debug('hit');

  if (!!this._health) {

    if (this._health > 1) {
      this._health--;
      debug(this._type + ' hit');
      return true;
    }

    this._health--;
    debug(this._type + ' destroyed');
    this._destroyed = true;
    return false;
  }

  return null;

};

module.exports = Ship;
