var snake = (function () {
  
  var velocityX = 0;
  var velocityY = 0;

  var playerX = 10;
  var playerY = 10;

  var gridSize = 20;
  var tileCount = 20;

  var fruitX = Math.floor(Math.random() * tileCount);
  var fruitY = Math.floor(Math.random() * tileCount);

  var trail = [];
  var tail = 5;
  
  function setup () {
    document.body.style.backgroundColor='rgba(225,225,225,0.2)';
    canv = document.getElementById('gc');
    ctx = canv.getContext('2d');
    document.addEventListener('keydown', keyPush);
    
    game.reset();
    setInterval(game.loop,1000/15);
  }

  var game = {

    reset: function () {
      tail = 5;
      velocityX = 0;
      velocityY = 0;
      playerX = 10;
      playerY = 10;

      trail = [];
      trail.push({ x: playerX, y: playerY });
    },

    action: {
      up: function () {
        if (!(trail[0].y+1 == trail[1].y)){
          velocityX = 0;
          velocityY = -1;
        }
      },
      down: function () {
        if (!(trail[0].y-1 == trail[1].y)){
          velocityX = 0;
          velocityY = 1;
        }
      },
      left: function () {
        if (!(trail[0].x+1 == trail[1].x)) {
          velocityX = -1;
          velocityY = 0;
        }
      },
      right: function () {
        if (!(trail[0].x-1 == trail[1].x)) {
          velocityX = 1;
          velocityY = 0;
        }
      }
    },

    log: function () {
      console.log('====================');
      console.log('x:' + playerX + ', y:' + playerY);
      console.log('tail:' + tail + ', trail.length:' + trail.length);
    },

    loop: function () {
      playerX += velocityX;
      playerY += velocityY;
      
      if(playerX < 0) playerX = tileCount-1;
      if(playerX > tileCount-1) playerX = 0;
      if(playerY < 0) playerY = tileCount-1;
      if(playerY > tileCount-1) playerY = 0;
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0,0,canv.width,canv.height);
      
      for(var i=0; i<trail.length; i++) {
        ctx.fillStyle = 'lime';
        ctx.fillRect(trail[i].x * gridSize+1, trail[i].y * gridSize+1, gridSize-2, gridSize-2);
        
        if (trail[i].x == playerX && trail[i].y == playerY) game.reset();
      }
      
      if (playerX == fruitX && playerY == fruitY) {
        tail++;
        fruitX = Math.floor(Math.random()*tileCount);
        fruitY = Math.floor(Math.random()*tileCount);
      }
      trail.push({x:playerX, y:playerY});
      while(trail.length > tail) trail.shift();
      
      ctx.fillStyle = 'red';
      ctx.fillRect(fruitX * gridSize+1, fruitY * gridSize+1, gridSize-2, gridSize-2);
      
      game.log();
    }
  }

  function keyPush (evt) {
    switch(evt.keyCode) {
      case 37: //left
        game.action.left();
        break;

      case 38: //up
        game.action.up();
        break;
        
        case 39: //right
        game.action.right();
        break;
        
        case 40: //down
        game.action.down();
        break;

      case 32:
      case 27:
        game.reset();
    }
  }

  window.onload = setup;
})();