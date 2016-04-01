var Game = function() {};

function rollDice(dice) {
  return dice.map(function() {
    return Math.floor(Math.random() * 6) + 1;
  });
}

Game.prototype.new = function() {
  this.score = 0;
  this.step = 0;
  this.dice = [];
  this.kept = [];
};

Game.prototype.throw = function() {
  if (this.dice.length == 6) {
    return false;
  }
  if (this.dice.length == 0) {
    this.dice = [0, 0, 0, 0, 0, 0];
  }
  this.dice = rollDice(this.dice);
  return true;
};

Game.prototype.keep = function () {
  var args = Array.prototype.slice.call(arguments);
  var kept = [];
  var dice = this.dice.filter(function(value, index) {
    if (args.indexOf(index) == -1) {
      return true;
    }
    kept.push(value);
    return false;
  });
  this.dice = dice;
  this.kept.push(kept);
};

module.exports = new Game();
