var should = require('should'), assert = require('assert'),
    _ = require('lodash');

var game = require('../lib/game.js');

describe('Game', function() {
  describe('when initialized', function() {
    beforeEach(function() { game.new(); });

    it('should have score 0', function() { game.score.should.equal(0); });

    it('should have no thrown dice',
       function() { game.dice.should.have.length(0); });

  });

  describe('when dice thrown', function() {
    beforeEach(function() {
      game.new();
      game.throw();
    });

    it('should have six thrown dice',
       function() { game.dice.should.have.length(6); });

    it('should require player to keep one or more dice', function() {
      game.throw.bind(game).should.throw(game.ZonkException);
      game.dice[0] = 1;
      game.keep(0);
      _.flattenDeep(game.kept).should.have.length(1);
      game.kept[0].should.deepEqual([ 0 ]);
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
      game.kept.should.deepEqual([ [ 0, 1 ] ]);
      game.unkeep(0);
      game.kept.should.deepEqual([ [ 1 ] ]);
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
        setDice('1.....');
        game.keep(0);
        game.score.should.equal(100);
      });

      it('gives 200 pts if two are kept', function() {
        setDice('11....');
        game.keep(0, 1);
        game.score.should.equal(200);
      });

      it('gives 1000 pts if three are kept', function() {
        setDice('111...');
        game.keep(0, 1, 2);
        game.score.should.equal(1000);
      });

      it('gives 1000+1000+... pts if more than 3 are kept', function() {
        setDice('1111..');
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

    describe('keeping "2"', function() {
      beforeEach(function() {
        game.new();
        game.throw();
      });

      it('gives 0 pts when less than 3 are kept', function() {
        setDice('22....');
        game.keep(0, 1);
        game.score.should.equal(0);
      });

      it('gives 200 pts when 3 are kept', function() {
        setDice('222...');
        game.keep(0, 1, 2);
        game.score.should.equal(200);
      });

      it('gives 200+200+... pts when more than 3 are kept', function() {
        setDice('2222..');
        game.keep(0, 1, 2, 3);
        game.score.should.equal(400);
        game.dice[4] = 2;
        game.keep(4);
        game.score.should.equal(600);
        game.dice[5] = 2;
        game.keep(5);
        game.score.should.equal(800);
      });
    });

    describe('keeping "3"', function() {
      beforeEach(function() {
        game.new();
        game.throw();
      });

      it('gives 0 pts when less than 3 are kept', function() {
        setDice('33....');
        game.keep(0, 1);
        game.score.should.equal(0);
      });

      it('gives 300 pts when 3 are kept', function() {
        setDice('333...');
        game.keep(0, 1, 2);
        game.score.should.equal(300);
      });

      it('gives 300+300+... pts when more than 3 are kept', function() {
        setDice('3333..');
        game.keep(0, 1, 2, 3);
        game.score.should.equal(600);
        game.dice[4] = 3;
        game.keep(4);
        game.score.should.equal(900);
        game.dice[5] = 3;
        game.keep(5);
        game.score.should.equal(1200);
      });
    });

    describe('keeping "4"', function() {
      beforeEach(function() {
        game.new();
        game.throw();
      });

      it('gives 0 pts when less than 3 are kept', function() {
        setDice('44.....');
        game.keep(0, 1);
        game.score.should.equal(0);
      });

      it('gives 400 pts when 3 are kept', function() {
        setDice('444...');
        game.keep(0, 1, 2);
        game.score.should.equal(400);
      });

      it('gives 400+400+... pts when more than 3 are kept', function() {
        setDice('4444..');
        game.keep(0, 1, 2, 3);
        game.score.should.equal(800);
        game.dice[4] = 4;
        game.keep(4);
        game.score.should.equal(1200);
        game.dice[5] = 4;
        game.keep(5);
        game.score.should.equal(1600);
      });
    });

    describe('keeping "5"', function() {
      beforeEach(function() {
        game.new();
        game.throw();
      });

      it('gives 50 pts if one is kept', function() {
        setDice('5.....');
        game.keep(0);
        game.score.should.equal(50);
      });

      it('gives 100 pts if two are kept', function() {
        setDice('55....');
        game.keep(0, 1);
        game.score.should.equal(100);
      });

      it('gives 500 pts if three are kept', function() {
        setDice('555...');
        game.keep(0, 1, 2);
        game.score.should.equal(500);
      });

      it('gives 500+500+... pts if more than 3 are kept', function() {
        setDice('5555..');
        game.keep(0, 1, 2, 3);
        game.score.should.equal(1000);
        game.dice[4] = 5;
        game.keep(4);
        game.score.should.equal(1500);
        game.dice[5] = 5;
        game.keep(5);
        game.score.should.equal(2000);
      });
    });

    describe('keeping "6"', function() {
      beforeEach(function() {
        game.new();
        game.throw();
      });

      it('gives 0 pts when less than 3 are kept', function() {
        setDice('66....');
        game.keep(0, 1);
        game.score.should.equal(0);
      });

      it('gives 600 pts when 3 are kept', function() {
        setDice('666...');
        game.keep(0, 1, 2);
        game.score.should.equal(600);
      });

      it('gives 600+600+... pts when more than 3 are kept', function() {
        setDice('6666..');
        game.keep(0, 1, 2, 3);
        game.score.should.equal(1200);
        game.dice[4] = 6;
        game.keep(4);
        game.score.should.equal(1800);
        game.dice[5] = 6;
        game.keep(5);
        game.score.should.equal(2400);
      });
    });

    describe('keeping various dice', function() {
      beforeEach(function() {
        game.new();
        game.throw();
      });

      it('gives 150 pts when "1" and "5" are kept', function() {
        setDice('15....');
        game.keep(0, 1);
        game.score.should.equal(150);
      });

      it('gives 300 pts when 3x"2" and "1" are kept', function() {
        setDice('2122..');
        game.keep(0, 1, 2, 3);
        game.score.should.equal(300);
      });

      it('gives 550 pts when 3x"4", "5" and "1" are kept', function() {
        setDice('41454.');
        game.keep(0, 1, 2, 3, 4);
        game.score.should.equal(550);
      });

      it('gives 750 pts when three pairs are kept', function() {
        setDice('123123');
        game.keep(0, 1, 2, 3, 4, 5);
        game.score.should.equal(750);
      });

      it('gives 1000 pts when all kept dice make sequence 1..6', function() {
        setDice('162534');
        game.keep(0, 1, 2, 3, 4, 5);
        game.score.should.equal(1000);
      });
    });

  });

});

function fillDice(dice, value) {
  return dice.map(function() { return value; });
}

function setDice(pattern) {
  game.dice = game.dice.map(function(value, index) {
    if (pattern.charAt(index) == '.') {
      return value;
    } else {
      return +pattern.charAt(index);
    }
  });
}
