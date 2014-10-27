'use strict';

var canvas = document.getElementById('life');
canvas.width = window.innerWidth+10;
canvas.height = window.innerHeight+10;
var context = canvas.getContext('2d');

var x = Math.floor(canvas.width/3); 
var y = Math.floor(canvas.height/3);
var startPercentage = .2;


var game = new GameOfLife(x, y);
for (var i = 0; i < y; i++){
  for (var j = 0; j < x; j++){
    if (Math.random() < startPercentage){
      game.setSquare(j, i, true);
    }
  }
}

function animate(){
  context.fillStyle = 'rgba(20,20,20,0.20)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#00CC00';

  game.forEach(function(val, x, y){
    var num;
    if (val){
      num = game.getNumNeighbors(x, y);
      context.fillRect(x*3, y*3, 3, 3);
    }
  });
  game.tick();
  setTimeout(function(){
    animate();
  }, 20);

  // window.requestAnimationFrame(animate);
}

animate();

//add polyfill for requestAnimationFrame

// var testGame = new GameOfLife(5, 5);
// testGame.randomize(0.2);

// function run(){
//   testGame.print();
//   testGame.tick();
//   setTimeout(function(){
//     run();
//   }, 5000);
// }

// run();