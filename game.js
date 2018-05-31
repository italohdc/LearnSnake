var Snake = (function () {

  const INITIAL_TAIL = 5;

  var intervalID;
  
  var velocity = { x:0, y:0 };
  var player = { x:10, y:10 };

  var tileCount = 5;
  var gridSize = 400/tileCount;

  var walls = false;

  var fruit = { x:Math.floor(Math.random() * tileCount),
                y:Math.floor(Math.random() * tileCount) };

  var trail = [];
  var tail = INITIAL_TAIL;

  var reward = 0;

  var ActionEnum = { 'none':0, 'up':1, 'down':2, 'left':3, 'right':4 };
  Object.freeze(ActionEnum);
  var lastAction = ActionEnum.none;
  
  function setup () {
    canv = document.getElementById('gc');
    ctx = canv.getContext('2d');
    // document.addEventListener('keydown', keyPush);
    // document.body.style.backgroundColor='rgba(225,225,225,0.2)';
    
    game.reset();
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
      this.RandomFruit();
      reward = -1;

      lastAction = ActionEnum.none;

      trail = [];
      trail.push({ x: player.x, y: player.y });
      // for(var i=0; i<tail; i++) trail.push({ x: player.x, y: player.y });
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

    RandomFruit: function () {
      if(walls){
        fruit.x = 1+Math.floor(Math.random() * (tileCount-2));
        fruit.y = 1+Math.floor(Math.random() * (tileCount-2));
      }
      else {
        fruit.x = Math.floor(Math.random() * tileCount);
        fruit.y = Math.floor(Math.random() * tileCount);
      }
    },

    log: function () {
      console.log('====================');
      console.log('x:' + player.x + ', y:' + player.y);
      console.log('tail:' + tail + ', trail.length:' + trail.length);
    },

    loop: function () {

      reward = 0;

      function DontHitWall () {
        if(player.x < 0) player.x = tileCount-1;
        if(player.x >= tileCount) player.x = 0;
        if(player.y < 0) player.y = tileCount-1;
        if(player.y >= tileCount) player.y = 0;
      }
      function HitWall () {
        if(player.x < 1) game.reset();
        if(player.x > tileCount-2) game.reset();
        if(player.y < 1) game.reset();
        if(player.y > tileCount-2) game.reset();

        ctx.fillStyle = 'grey';
        ctx.fillRect(0,0,gridSize-1,canv.height);
        ctx.fillRect(0,0,canv.width,gridSize-1);
        ctx.fillRect(canv.width-gridSize+1,0,gridSize,canv.height);
        ctx.fillRect(0, canv.height-gridSize+1,canv.width,gridSize);
      }

      var stopped = velocity.x == 0 && velocity.y == 0;
      
      player.x += velocity.x;
      player.y += velocity.y;
      
      if (velocity.x == 0 && velocity.y == -1) lastAction = ActionEnum.up;
      if (velocity.x == 0 && velocity.y == 1) lastAction = ActionEnum.down;
      if (velocity.x == -1 && velocity.y == 0) lastAction = ActionEnum.left;
      if (velocity.x == 1 && velocity.y == 0) lastAction = ActionEnum.right;
      
      ctx.fillStyle = 'rgba(40,40,40,0.8)';
      ctx.fillRect(0,0,canv.width,canv.height);
      
      if(walls) HitWall();
      else DontHitWall();
      
      // game.log();
      
      if (!stopped){
        trail.push({x:player.x, y:player.y});
        while(trail.length > tail) trail.shift();
      }

      if(!stopped) {
        ctx.fillStyle = 'rgba(200,200,200,0.2)';
        ctx.font = "small-caps 14px Helvetica";
        ctx.fillText("(esc) reset", 24, 356);
        ctx.fillText("(space) pause", 24, 374);
      }
      
      ctx.fillStyle = 'green';
      for(var i=0; i<trail.length-1; i++) {
        ctx.fillRect(trail[i].x * gridSize+1, trail[i].y * gridSize+1, gridSize-2, gridSize-2);
        
        // console.debug(i + ' => player:' + player.x, player.y + ', trail:' + trail[i].x, trail[i].y);
        if (!stopped && trail[i].x == player.x && trail[i].y == player.y){
          game.reset();
        }
        ctx.fillStyle = 'lime';
      }
      ctx.fillRect(trail[trail.length-1].x * gridSize+1, trail[trail.length-1].y * gridSize+1, gridSize-2, gridSize-2);
      
      if (player.x == fruit.x && player.y == fruit.y) {
        tail++;
        reward = 1;
        game.RandomFruit();
        // make sure new fruit didn't spawn in snake tail 
        while((function () {
          for(var i=0; i<trail.length; i++) {
            if (trail[i].x == fruit.x && trail[i].y == fruit.y) {
              game.RandomFruit();
              return true;
            }
          }
          return false;
        })());
      }
      
      ctx.fillStyle = 'red';
      ctx.fillRect(fruit.x * gridSize+1, fruit.y * gridSize+1, gridSize-2, gridSize-2);
      
      if(stopped) {
        ctx.fillStyle = 'rgba(250,250,250,0.8)';
        ctx.font = "small-caps bold 14px Helvetica";
        ctx.fillText("press ARROW KEYS to START...", 24, 374);
      }

      ctx.fillStyle = 'white';
      ctx.font = "bold small-caps 16px Helvetica";
      ctx.fillText("size: " + tail, 310, 40);

      return reward;
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
      
      case 32: //space
      Snake.pause();
      break;
      
      case 27: //esc
      game.reset();
      break;
    }
  }

  return {
    
    init: function () {
      window.onload = setup;
    },

    start: function (fps = 15) {
      window.onload = setup;
      intervalID = setInterval(game.loop, 1000 / fps);
    },

    loop: game.loop,

    stop: function () {
      clearInterval(intervalID);
    },
    
    setup: {
      keyboard: function (state) {
        if (state) document.addEventListener('keydown', keyPush);
        else document.removeEventListener('keydown', keyPush);
      },
      wall: function (state) {
        walls = state;
      }
    },

    action: function (act) {
      switch(act) {
        case 'left':
          game.action.left();
          break;

        case 'up':
          game.action.up();
          break;

        case 'right':
          game.action.right();
          break;

        case 'down':
          game.action.down();
          break;
      }
    },
    
    pause: function () {
      velocity.x = 0;
      velocity.y = 0;
    },

    data:  {
      player: player,
      fruit: fruit,
      trail: function () {
        return trail;
      }
    },

    info: {
      tileCount: tileCount
    }
  };

})();

Snake.init();
Snake.setup.keyboard(false);
// Snake.setup.wall(false);
// Snake.start(15);
// Snake.pause();
// Snake.stop();
