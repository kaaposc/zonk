var Game = function() {};

Game.prototype.new = function() {
  this.score = 0;
  this.dice = [];
};

Game.prototype.throw = function() {
  if (this.dice.length == 6) {
    return false;
  }
  this.dice = [1, 2, 3, 4, 5, 6];
  return true;
};

Game.prototype.keep = function () {
  this.kept = [[1]];
};

module.exports = new Game();
