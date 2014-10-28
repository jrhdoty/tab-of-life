'use strict';

var Cell = function(status, neighbors){
  this.nextState    = status || false;
  this.currentState = status || false;

  this.nextActiveNeighbors    = 0;
  this.currentActiveNeighbors = neighbors || 0;
};

var Grid = function(x, y){
  //add padding to borders
  x+=2;
  y+=2;
  this.dimX = x;
  this.dimY = y;
  this.grid = Array.apply(null, Array(y)).map(function(){
    return Array.apply(null, Array(x)).map(function(){
      return new Cell(false, 0);
  });});
};

//used to initialize values
Grid.prototype.setCell = function(x, y){
  //simplify interface by taking borders into account internally
  x++;
  y++;

  //update neighbor's count of neighbors
  //row above
  this.grid[y-1][x-1].currentActiveNeighbors++;
  this.grid[y-1][x].currentActiveNeighbors++;
  this.grid[y-1][x+1].currentActiveNeighbors++;
  this.grid[y-1][x-1].nextActiveNeighbors++;
  this.grid[y-1][x].nextActiveNeighbors++;
  this.grid[y-1][x+1].nextActiveNeighbors++;

  //same row
  this.grid[y][x-1].currentActiveNeighbors++;
  this.grid[y][x+1].currentActiveNeighbors++;
  this.grid[y][x-1].nextActiveNeighbors++;
  this.grid[y][x+1].nextActiveNeighbors++;

  //row below
  this.grid[y+1][x-1].currentActiveNeighbors++;
  this.grid[y+1][x].currentActiveNeighbors++;
  this.grid[y+1][x+1].currentActiveNeighbors++;
  this.grid[y+1][x-1].nextActiveNeighbors++;
  this.grid[y+1][x].nextActiveNeighbors++;
  this.grid[y+1][x+1].nextActiveNeighbors++;

  //update state
  this.grid[y][x].currentState = true;
};

Grid.prototype.clearCell = function(x, y){
  //simplify interface by taking borders into account internally
  x++;
  y++;
  //update neighbor count of neighbors
  //row above
  this.grid[y-1][x-1].currentActiveNeighbors--;
  this.grid[y-1][x].currentActiveNeighbors--;
  this.grid[y-1][x+1].currentActiveNeighbors--;

  //same row
  this.grid[y][x-1].currentActiveNeighbors--;
  this.grid[y][x+1].currentActiveNeighbors--;

  //row below
  this.grid[y+1][x-1].currentActiveNeighbors--;
  this.grid[y+1][x].currentActiveNeighbors--;
  this.grid[y+1][x+1].currentActiveNeighbors--;

  //update state
  this.grid[y][x].currentState = false;
};

Grid.prototype.calculateNextState = function(x, y){
  x++;
  y++;

  var i = 0;
  var cell = this.grid[y][x];
  cell.nextState = cell.currentState;
  if ( cell.currentState ){
    //cell dies, decrement count of neighbor's neighbors by 1
    if (cell.currentActiveNeighbors < 2 || cell.currentActiveNeighbors > 3){
      i = -1; 
      cell.nextState = false;
    }
  }
  //cell is born, increment count of neighbor's neighbors by 1
  else if (cell.currentActiveNeighbors === 3) {
    i = 1;
    cell.nextState = true;
  }
  
  //update neighbor count of neighbors if there was a switch
  if (i){
    //row above
    this.grid[y-1][x-1].nextActiveNeighbors+=i;
    this.grid[y-1][x].nextActiveNeighbors+=i;
    this.grid[y-1][x+1].nextActiveNeighbors+=i;

    //same row
    this.grid[y][x-1].nextActiveNeighbors+=i;
    this.grid[y][x+1].nextActiveNeighbors+=i;

    //row below
    this.grid[y+1][x-1].nextActiveNeighbors+=i;
    this.grid[y+1][x].nextActiveNeighbors+=i;
    this.grid[y+1][x+1].nextActiveNeighbors+=i;
  }
};

Grid.prototype.print = function(){
  var str = '';
  for (var i = 1; i < this.dimY-1; i++ ){
    for (var j = 1; j < this.dimX-1; j++ ){
      str = str+this.grid[i][j].currentState + ', ';
    }
    str = str + '\n';
  }
  console.log(str);
};

Grid.prototype.printNeighbors = function(){
  var str = '';
  for (var i = 1; i < this.dimY-1; i++ ){
    for (var j = 1; j < this.dimX-1; j++ ){
      str = str+this.grid[i][j].currentActiveNeighbors + ', ';
    }
    str = str + '\n';
  }
  console.log(str);
};

Grid.prototype.forEach = function(cb){
  var i, j;
  for ( i = 1; i < this.dimY-2; i++ ){
    for ( j = 1; j < this.dimX-2; j++ ){
      cb(this.grid[i][j], j-1, i-1);
    }
  } 
};

Grid.prototype.updateCell = function(x, y){
  var cell = this.grid[y+1][x+1];
  cell.currentState = cell.nextState;
  cell.currentActiveNeighbors = cell.nextActiveNeighbors;
};

Grid.prototype.calculateAll = function(){
  var that = this;
  this.forEach(function(cell, x, y){
    if (cell.currentState || cell.currentActiveNeighbors){
      that.calculateNextState(x, y);
    }
  });
};

Grid.prototype.updateAll = function(){
  var that = this;
  this.forEach(function(cell, x, y){
      that.updateCell(x, y);
  });
};

Grid.prototype.tick = function(){
  this.calculateAll();
  this.updateAll();
};

Grid.prototype.cellState = function(x, y){
  return this.grid[y+1][x+1].currentState;
};


var GameOfLife = function(x, y){
  this.xDim = x;
  this.yDim = y;
  this.grid = new Grid(x, y);
};

GameOfLife.prototype.createGrid = function(x, y){
  return new Grid(x, y);
};

//iter takes arguments (item, xCoord, yCoord)
GameOfLife.prototype.forEach = function(iter){
  var x, y;
  for( y = 0; y < this.yDim; y++ ){
    for( x = 0; x < this.xDim; x++ ){
      iter(this.grid.cellState(x, y), x, y);
    }
  }
};

GameOfLife.prototype.randomize = function(percentage){
  var that = this;
  this.grid = this.createGrid(this.xDim, this.yDim);
  this.forEach(function(val, x, y){
    if (Math.random() < percentage){
      that.grid.setCell(x, y);
    }
  });
};

GameOfLife.prototype.printState = function(){
  this.grid.print();
};

GameOfLife.prototype.printNeighbors = function(){
  this.grid.printNeighbors();
};




GameOfLife.prototype.tick = function(){
  this.grid.tick();
};
