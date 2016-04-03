var _ = require('lodash');

var ZonkException = function(message) {
  this.message = message;
  this.name = 'ZonkException';
};

var Game = function() {};

Game.prototype.ZonkException = ZonkException;

Game.prototype.new = function() {
  this.score = 0;
  this.step = 0;
  this.dice = [];
  this.kept = [];
};

Game.prototype.throw = function() {
  var kept = this.kept[this.step] || [];
  if ((kept.length == 0) && (this.dice.length > 0)) {
    throw new ZonkException("Keep at least one die!");
  }
  if (this.dice.length == 0) {
    this.dice = [0, 0, 0, 0, 0, 0];
  }
  this.dice = this._rollDice(this.dice);
};

Game.prototype.keep = function() {
  var args = Array.prototype.slice.call(arguments);
  var kept = this.kept[this.step] || [];
  this.kept[this.step] = _.uniq(_.concat(kept, args));
  this._calculateScore();
};

Game.prototype.unkeep = function(index) {
  this.kept[this.step] = _.without(this.kept[this.step], index);
};

// helper functions
Game.prototype._rollDice = function(dice) {
  var kept = _.flattenDeep(this.kept);
  return dice.map(function(value, index) {
    if (kept.indexOf(index) > -1) {
      return value;
    }
    return Math.floor(Math.random() * 6) + 1;
  });
};

Game.prototype._calculateScore = function() {
  var score = 0;
  var kept = _.flattenDeep(this.kept);
  var values = this.dice.filter(function(val, idx) {
    return kept.indexOf(idx) > -1;
  });
  var ones = values.filter(function(value) { return value == 1; }).length;
  if (ones >= 3) {
    score += 1000 * (ones - 2);
  } else {
    score = values.reduce(function(sum, value) {
      if (value == 1) {
        sum += 100;
      }
      return sum;
    }, 0);
  }
  var twos = values.filter(function(value) { return value == 2; }).length;
  if (twos >= 3) {
    score += 200 * (twos - 2);
  }
  this.score = score;
};

module.exports = new Game();
