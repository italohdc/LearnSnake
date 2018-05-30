var snake = (function () {

  const FPS = 15;
  const INITIAL_TAIL = 5;
  
  var velocity = { x:0, y:0 };
  var player = { x:10, y:10 };

  var gridSize = 20;
  var tileCount = 20;

  var fruit = { x:Math.floor(Math.random() * tileCount),
                y:Math.floor(Math.random() * tileCount) };

  var trail = [];
  var tail = INITIAL_TAIL;

  var ActionEnum = { 'none':0, 'up':1, 'down':2, 'left':3, 'right':4 };
  Object.freeze(ActionEnum);
  var lastAction = ActionEnum.none;
  
  function setup () {
    document.body.style.backgroundColor='rgba(225,225,225,0.2)';
    canv = document.getElementById('gc');
    ctx = canv.getContext('2d');
    document.addEventListener('keydown', keyPush);
    
    game.reset();
    setInterval(game.loop,1000/FPS);
  }

  var game = {

    reset: function () {
      ctx.fillStyle = 'grey';
      ctx.fillRect(0, 0, canv.width, canv.height);

      tail = INITIAL_TAIL;
      velocity.x = 0;
      velocity.y = 0;
      player.x = 10;
      player.y = 10;
      fruit.x = Math.floor(Math.random() * tileCount);
      fruit.y = Math.floor(Math.random() * tileCount);

      lastAction = ActionEnum.none;

      trail = [];
      trail.push({ x: player.x, y: player.y });
    },

    action: {
      up: function () {
        if (lastAction != ActionEnum.down){
          velocity.x = 0;
          velocity.y = -1;
        }
      },
      down: function () {
        if (lastAction != ActionEnum.up){
          velocity.x = 0;
          velocity.y = 1;
        }
      },
      left: function () {
        if (lastAction != ActionEnum.right){
          velocity.x = -1;
          velocity.y = 0;
        }
      },
      right: function () {
        if (lastAction != ActionEnum.left){
          velocity.x = 1;
          velocity.y = 0;
        }
      }
    },

    log: function () {
      console.log('====================');
      console.log('x:' + player.x + ', y:' + player.y);
      console.log('tail:' + tail + ', trail.length:' + trail.length);
    },

    loop: function () {

      function DontHitWall () {
        if(player.x < 0) player.x = tileCount-1;
        if(player.x >= tileCount) player.x = 0;
        if(player.y < 0) player.y = tileCount-1;
        if(player.y >= tileCount) player.y = 0;
      }
      function HitWall () {
        if(player.x < 0) game.reset();
        if(player.x > tileCount-1) game.reset();
        if(player.y < 0) game.reset();
        if(player.y > tileCount-1) game.reset();
      }
      
      player.x += velocity.x;
      player.y += velocity.y;
      
      if (velocity.x == 0 && velocity.y == -1) lastAction = ActionEnum.up;
      if (velocity.x == 0 && velocity.y == 1) lastAction = ActionEnum.down;
      if (velocity.x == -1 && velocity.y == 0) lastAction = ActionEnum.left;
      if (velocity.x == 1 && velocity.y == 0) lastAction = ActionEnum.right;
      
      DontHitWall();
      
      // game.log();
      
      trail.push({x:player.x, y:player.y});
      while(trail.length > tail) trail.shift();
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0,0,canv.width,canv.height);

      ctx.fillStyle = 'grey';
      ctx.font = "small-caps 16px Helvetica";
      ctx.fillText("size: " + tail, 320, 30);
      
      ctx.fillStyle = 'green';
      for(var i=0; i<trail.length-1; i++) {
        ctx.fillRect(trail[i].x * gridSize+1, trail[i].y * gridSize+1, gridSize-2, gridSize-2);
        
        // console.debug(i + ' => player:' + player.x, player.y + ', trail:' + trail[i].x, trail[i].y);
        if (!(velocity.x == 0 && velocity.y == 0) && trail[i].x == player.x && trail[i].y == player.y){
          game.reset();
        }
        ctx.fillStyle = 'lime';
      }
      ctx.fillRect(trail[trail.length-1].x * gridSize+1, trail[trail.length-1].y * gridSize+1, gridSize-2, gridSize-2);
      
      if (player.x == fruit.x && player.y == fruit.y) {
        tail++;
        fruit.x = Math.floor(Math.random()*tileCount);
        fruit.y = Math.floor(Math.random()*tileCount);
        
        while((function () {
          for(var i=0; i<trail.length; i++) {
            if (trail[i].x == fruit.x && trail[i].y == fruit.y) {
              fruit.x = Math.floor(Math.random()*tileCount);
              fruit.y = Math.floor(Math.random()*tileCount);
              return true;
            }
          }
          return false;
        })());
      }
      
      ctx.fillStyle = 'red';
      ctx.fillRect(fruit.x * gridSize+1, fruit.y * gridSize+1, gridSize-2, gridSize-2);
      
      if(velocity.x==0 && velocity.y==0) {
        ctx.fillStyle = 'grey';
        ctx.font = "small-caps 14px Helvetica";
        ctx.fillText("press ARROW KEYS to START...", 12, 386);
      }
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