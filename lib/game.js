var _ = require('lodash');

var ZonkException = function(message) {
  this.message = message;
  this.name = 'ZonkException';
};

var Game = function() {};

Game.prototype.ZonkException = ZonkException;

Game.prototype.new = function() {
  this.score = 0;
  this.zonk = false;
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
  var kept = _.flattenDeep(this.kept);
  var values = this.dice.filter(function(val, idx) {
    return kept.indexOf(idx) > -1;
  });
  this.score = availableScore(values);
};

Game.prototype._checkZonk = function () {
  if (availableScore(this.dice) == 0) {
    this.score = 0;
    this.zonk = true;
  }
};

function availableScore(values) {
  var pairs = _.countBy(
    _.countBy(values),
    function(val) {
      if (val == 2) {
        return 'pairs';
      } else {
        return 'singles';
      }
    }
  )['pairs'];
  if (pairs == 3) {
    return 750;
  }
  var sequence = _.countBy(
    _.countBy(values),
    function(val) {
      if (val == 1) {
        return 'single';
      } else {
        return 'more';
      }
    }
  )['single'];
  if (sequence == 6) {
    return 1000;
  }
  var score = 0;
  var ones = values.filter(function(value) { return value == 1; }).length;
  if (ones >= 3) {
    score += 1000 * (ones - 2);
  } else {
    score += 100 * ones;
  }
  var twos = values.filter(function(value) { return value == 2; }).length;
  if (twos >= 3) {
    score += 200 * (twos - 2);
  }
  var threes = values.filter(function(value) { return value == 3; }).length;
  if (threes >= 3) {
    score += 300 * (threes - 2);
  }
  var fours = values.filter(function(value) { return value == 4; }).length;
  if (fours >= 3) {
    score += 400 * (fours - 2);
  }
  var fives = values.filter(function(value) { return value == 5; }).length;
  if (fives >= 3) {
    score += 500 * (fives - 2);
  } else {
    score += 50 * fives;
  }
  var sixes = values.filter(function(value) { return value == 6; }).length;
  if (sixes >= 3) {
    score += 600 * (sixes - 2);
  }
  return score;
}

module.exports = new Game();
