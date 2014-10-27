'use strict';

var GameOfLife = function(x, y){
  this.xDim = x;
  this.yDim = y;
  this.grid = this.createGrid(x, y);
};

GameOfLife.prototype.createGrid = function(x, y){
  return Array.apply(null, Array(y)).map(function(){
    return Array.apply(null, Array(x)).map(function(){
      return false;
  });});
};

// GameOfLife.prototype.createGrid = function(x, y){
//   return Array.apply(null, Array(y)).map(function(){
//     return [];
//   });
// };

//iter takes arguments (item, xCoord, yCoord)
GameOfLife.prototype.forEach = function(iter){
  var x, y;
  for( y = 0; y < this.yDim; y++ ){
    for( x = 0; x < this.xDim; x++ ){
      iter(this.grid[y][x], x, y);
    }
  }
};

GameOfLife.prototype.randomize = function(percentage){
  var that = this;
  this.grid = this.createGrid(this.xDim, this.yDim);
  this.forEach(function(val, x, y){
    if (Math.random() < percentage){
      that.grid[y][x] = true;
    }
  });
};

GameOfLife.prototype.print = function(){
  console.log('inside of print');
  var str = '';
  var neighbors = '';
  for ( var i = 0; i < this.yDim; i++ ){
    str = str + this.grid[i].join(', ') + '\n';
    for (var j = 0; j < this.xDim; j++){
      neighbors = neighbors + this.getNumNeighbors(j, i) + ', ';
    }
    neighbors = neighbors + '\n';
  }
  console.log(str);
  console.log(neighbors);
};

GameOfLife.prototype.setSquare = function(x, y, val){
  this.grid[y][x] = val;
};

GameOfLife.prototype.tick = function(){
  var that = this;
  var nextGrid = this.createGrid(this.xDim, this.yDim);
  this.forEach(function(val, x, y){
    var num = that.getNumNeighbors(x, y);
    if (val){
      if (num >= 2 && num <= 3){
        nextGrid[y][x] = true;
      }
    } else if ( num === 3 ){
      nextGrid[y][x] = true;
    }
  });
  this.grid = nextGrid;
};

GameOfLife.prototype.getNumNeighbors = function(x, y){
  var total = 0;
  for(var i = -1; i < 2; i++){
    total += this.grid[y-1] ? this.grid[y-1][x+i] === true ? 1 : 0 : 0; //row above
    total += this.grid[y+1] ? this.grid[y+1][x+i] === true ? 1 : 0 : 0; //row below
  }
  total += this.grid[y][x-1] === true ? 1 : 0; //left side
  total += this.grid[y][x+1] === true ? 1 : 0; //right side
  return total;
};



