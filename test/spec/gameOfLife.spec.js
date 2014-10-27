/* global describe, it */

(function () {
  'use strict';

  describe('Game Of Life class', function () {
    describe('Grid functions', function () {
      var game, grid, x, y; 
      beforeEach(function(){
        x = 5;
        y = 10;
        console.log(GameOfLife);
        game = new GameOfLife(x, y);
        grid = game.createGrid(x, y);
      });

      it('grid should have proper dimensions', function () {
        for ( var i = 0; i < y; i++ ){
          for ( var j = 0; j < x; j++ ){
            expect(grid[y][x]).to.equal(false);
          }
        }
      });
    });
  });
})();
