var should = require('should');
var game = require('../lib/game.js');

describe('Game', function() {
  describe('when initialized', function() {
    before(function() {
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
    before(function() {
      game.new();
      game.throw();
    });

    it('should have six thrown dice', function() {
      game.dice.should.have.length(6);
    });

    it('should require player to keep one or more dice', function() {
      game.throw().should.equal(false);
      game.dice[0] = 1;
      game.keep(0);
      game.kept.should.have.length(1);
      game.kept[0].should.deepEqual([1]);
    });
  });


});
