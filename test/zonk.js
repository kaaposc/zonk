var should = require('should'),
  assert = require('assert'),
  _ = require('lodash');

var game = require('../lib/game.js');

describe('Game', function() {
  describe('when initialized', function() {
    beforeEach(function() {
      game.new();
    });

    it('should have score 0', function() {
      game.score.should.equal(0);
    });

    it('should have no thrown dice', function() {
      game.dice.should.have.length(0);
    });

  });

  describe('when dice thrown', function() {
    beforeEach(function() {
      game.new();
      game.throw();
    });

    it('should have six thrown dice', function() {
      game.dice.should.have.length(6);
    });

    it('should require player to keep one or more dice', function() {
      game.throw.bind(game).should.throw(game.ZonkException);
      game.dice[0] = 1;
      game.keep(0);
      _.flattenDeep(game.kept).should.have.length(1);
      game.kept[0].should.deepEqual([0]);
      game.throw.bind(game).should.not.throw();
    });
  });

  describe('when keeping one or more dice', function() {
    beforeEach(function() {
      game.new();
      game.throw();
    });

    it('should throw only 5 dice after one is kept', function() {
      var IMPOSSIBLE_VALUE = -1;
      game.dice[0] = 1;
      game.keep(0);
      game.dice = fillDice(game.dice, IMPOSSIBLE_VALUE);
      game.throw();
      game.dice[0].should.equal(IMPOSSIBLE_VALUE);
      game.dice[1].should.not.equal(IMPOSSIBLE_VALUE);
    });

    it('should throw only 3 dice after three are kept', function() {
      var IMPOSSIBLE_VALUE = -1;
      game.dice[0] = 1;
      game.dice[2] = 1;
      game.dice[3] = 5;
      game.keep(0, 2, 3);
      game.dice = fillDice(game.dice, IMPOSSIBLE_VALUE);
      game.throw();
      game.dice[0].should.equal(IMPOSSIBLE_VALUE);
      game.dice[1].should.not.equal(IMPOSSIBLE_VALUE);
      game.dice[2].should.equal(IMPOSSIBLE_VALUE);
      game.dice[3].should.equal(IMPOSSIBLE_VALUE);
      game.dice[4].should.not.equal(IMPOSSIBLE_VALUE);
    });

    it('should throw die that has been kept and then un-kept', function() {
      var IMPOSSIBLE_VALUE = -1;
      game.dice[0] = 1;
      game.keep(0);
      game.dice[1] = 5;
      game.keep(1);
      game.kept.should.deepEqual([[0, 1]]);
      game.unkeep(0);
      game.kept.should.deepEqual([[1]]);
      game.dice = fillDice(game.dice, IMPOSSIBLE_VALUE);
      game.throw();
      game.dice[0].should.not.equal(IMPOSSIBLE_VALUE);
      game.dice[1].should.equal(IMPOSSIBLE_VALUE);
    })

  });

  describe('rules say', function() {
    describe('keeping "1"', function() {
      beforeEach(function() {
        game.new();
        game.throw();
      });

      it('gives 100 pts if one is kept', function() {
        game.dice[0] = 1;
        game.keep(0);
        game.score.should.equal(100);
      });

      it('gives 200 pts if two are kept', function() {
        game.dice[0] = game.dice[1] = 1;
        game.keep(0, 1);
        game.score.should.equal(200);
      });

      it('gives 1000 pts if three are kept', function() {
        game.dice[0] = game.dice[1] = game.dice[2] = 1;
        game.keep(0, 1, 2);
        game.score.should.equal(1000);
      });

      it('gives 1000+1000+... pts if more than 3 are kept', function() {
        game.dice[0] = game.dice[1] = game.dice[2] = game.dice[3] = 1;
        game.keep(0, 1, 2, 3);
        game.score.should.equal(2000);
        game.dice[4] = 1;
        game.keep(4);
        game.score.should.equal(3000);
        game.dice[5] = 1;
        game.keep(5);
        game.score.should.equal(4000);
      });
    });
  });

});

function fillDice(dice, value) {
  return dice.map(function() {
    return value;
  });
}
