'use strict';
(function(){
  var canvas, context, startPercentage, game, x, y;
  canvas = document.getElementById('life');
  canvas.width = window.innerWidth+10;
  canvas.height = window.innerHeight+10;
  context = canvas.getContext('2d');

  x = Math.floor(canvas.width/3); 
  y = Math.floor(canvas.height/3);
  startPercentage = 0.17;

  game = new GameOfLife(x, y);
  game.randomize(startPercentage);

  (function animate(){
    context.fillStyle = 'rgba(20,20,20,.35)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#00CC00';

    game.forEach(function(val, x, y){
      if (val){
        context.fillRect(x*3, y*3, 3, 3);
      }
    });

    game.tick();
    window.requestAnimationFrame(animate);
  })();
})();