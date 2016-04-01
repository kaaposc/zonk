var should = require('should');
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
      game.throw().should.equal(false);
      game.dice[0] = 1;
      game.keep(0);
      game.kept.should.have.length(1);
      game.kept[0].should.deepEqual([1]);
    });
  });

  describe('when keeping one or more dice', function() {
    beforeEach(function() {
      game.new();
      game.throw();
    });

    it('should have 5 throwable dice *after* one is kept', function() {
      game.dice[0] = 1;
      game.keep(0);
      game.dice.should.have.length(6);
      game.throw();
      game.dice.should.have.length(5);
    });

    it('should have 3 throwable dice after three are kept', function() {
      game.dice[0] = 1;
      game.dice[1] = 1;
      game.dice[2] = 5;
      game.keep(0, 1, 2);
      game.dice.should.have.length(3);
    });

    it('should throw only 5 dice after one is kept', function() {
      game.dice[0] = 1;
      game.keep(0);
      game.throw();
      game.dice.should.have.length(5);
    });
  });

  describe('rules say', function() {
    describe('', function() {})
  });

});
