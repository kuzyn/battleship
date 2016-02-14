  /**
   * Create a Boat object
   * @param {string} _type Named type of our boat, ex. 'submarine'
   */
  function Boat(_type) {
    this.type = _type;
    this.code = _type.charAt(0).toUpperCase();
    this.size = this.rules(_type);
    this.health = this.size;
    this.position = {
      "bow": [undefined, undefined],
      "stern": [undefined, undefined]
    };
    this.hit = this.hit;
  }

  /**
   * Share a size reference between all Boat
   * @type {object} _boat
   */
  Boat.prototype.rules = function(_boat) {
    var size = {
                "carrier": 5,
                "battleship": 4,
                "submarine": 3,
                "destroyer": 3,
                "patrol_boat": 2
              };
    return size[_boat];
  };

  /**
   * Register a hit on our Boat
   * @return {[type]} [description]
   */
  Boat.prototype.hit = function() {
    var self = this;
    if (!!self.health) {
      if (self.health > 1) {
        self.health--;
        return self.health;
      }
      self.health--;
      return self.code;
    }
    return 'X';
  };

module.exports = Boat;
