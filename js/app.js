///////////////////////////////////////////////////////////////
//                                                           //
// app.js: javascript enemy and player object definitions    //
//                                                           //
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
// Game State:                                               //
// This section controls the play, pause and resetting       //
// of the game.                                              //
///////////////////////////////////////////////////////////////

var states = {
    PAUSED: 0,
    RUNNING: 1,
};

var gameState = states.PAUSED;

// function for Pause button
function pauseGame() {
  gameState = states.PAUSED;
  document.getElementById("startButton").disabled = false;
  document.getElementById("pauseButton").disabled = true;
  document.getElementById("messages1").innerHTML = "Game Paused" ;
}

// function for start button
function startGame() {
  gameState = states.RUNNING;
  document.getElementById("startButton").disabled = true;
  document.getElementById("pauseButton").disabled = false;
  var msg = "Game started.  ";
  msg += "<span style='font-size:x-small;'>";

  document.getElementById("messages1").innerHTML = msg;
  document.getElementById("messages2").innerHTML = "";
}

// function for reset button
function resetGame() {
  player.reset();
  document.getElementById("score1").innerHTML = 0;
  document.getElementById("messages2").innerHTML = "Player was Reset";
  pauseGame();
}

/////////////////////////////////////////////////////////////
//                                                         //
// Enemies to be avoided by the players.                   //
//                                                         //
/////////////////////////////////////////////////////////////

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // potential rows for the enemy to exist on grid
    this.rows = [225, 140, 55];

    // starting X position is the same always
    this.StartX = -1;
    this.x = this.StartX;

    // starting y position is generated randomly to be one of the rows
    this.y = this.randomY();

    // speed
    this.dx = this.randomDx();

    // far right boundary, used to calculate when enemy wraps around
    this.boundaryXright = 545;

    // used to create a boundary rectangle for collision checking
    this.width = 100;
    this.height = 50;
    this.Yoff = 90;
};


// function to calculate a new row for the enemy
Enemy.prototype.randomY = function(){
  var newY = Math.floor((Math.random() * 3) + 1) - 1;
  return this.rows[newY];
};

// function to calculate a new speed for the enemy
Enemy.prototype.randomDx = function(){
  var dx = Math.floor((Math.random() * 50) + 1) - 1;
  return dx + 30;
};

// somewhat random boundary for how far enemy can go beyond screen before resetting
Enemy.prototype.randomXBoundary = function() {
  var x1 = Math.floor((Math.random() * 350) + 1) - 1;
  return 500 + x1;
};

//////////////////////////////////////////////////////////////
//                                                          //
// Update the enemy's position, required method for game    //
// Parameter: dt, a time delta between ticks                //
//                                                          //
//////////////////////////////////////////////////////////////

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

  for	(var index = 0; index < allEnemies.length; index++) {
      var enemy = allEnemies[index];

      // if it crosses boundary then reset x
      if((enemy.x) > (enemy.boundaryXright)) {
        enemy.x = enemy.StartX;

        //and get random new y
        enemy.y = enemy.randomY();

        // get random new speed
        enemy.dx = enemy.randomDx();

        // get a random new x boundary
        enemy.boundaryXright  = enemy.randomXBoundary();
      }
      // otherwise it did not cross boundary yet, so just increment constant x
      else {
          enemy.x = enemy.x + (enemy.dx)*dt;
      }
  }
};


//////////////////////////////////////////////////////////////
//                                                          //
// Draw the enemy on the screen, required method for game   //
//                                                          //
//////////////////////////////////////////////////////////////
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//////////////////////////////////////////////////////////////
// Player                                                   //
//                                                          //
// This class requires an update(), render() and            //
// a handleInput() method.                                  //
//                                                          //
//////////////////////////////////////////////////////////////

var Player = function() {
    this.sprite = 'images/char-boy.png';

    // starting position
    this.StartX = -1;
    this.StartY = 375;

    // actual position
    this.x = this.StartX;
    this.y = this.StartY;
    this.tempX = 9999;
    this.tempY = 9999;

    // boundary to keep player on the screen
    this.boundaryXleft = -1;
    this.boundaryXright = 404;
    this.boundaryYtop = 35;
    this.boundaryYbottom = 375;

    // offset for when player moves, centers player on grid cell
    this.dx = 101;
    this.dy = 85;

    // used to create a boundary rectangle for collision checking
    this.width = 100;
    this.height = 90;
    this.Yoff = 90;

    this.score = 0;
};


////////////////////////////////////////////////////////////////////
//                                                                //
// Player update function will update the player position on the  //
// grid, keeping the player within the boundary.                  //
//                                                                //
////////////////////////////////////////////////////////////////////

Player.prototype.update = function() {

  if(( this.tempX >= this.boundaryXleft  ) && ( this.tempX <= this.boundaryXright )) {
    this.x = this.tempX;
  }
  if ((this.tempY >= this.boundaryYtop) && (this.tempY <= this.boundaryYbottom )) {
    this.y = this.tempY;
  }
  else if ((this.tempY < this.boundaryYtop) && (this.tempY != this.y)) {
    this.score += 100;
    document.getElementById("score1").innerHTML = this.score;
    this.reset();
  }
};

//////////////////////////////////////////////////////////////
//                                                          //
// Reset player to start position                           //
//                                                          //
//////////////////////////////////////////////////////////////

Player.prototype.reset = function() {
    this.x = this.StartX;
    this.y = this.StartY;

    // must also reset tempX, tempY or update() function will
    // continue to fall through to the 'else if' clause
    this.tempX = this.StartX;
    this.tempY = this.StartY;
};

//////////////////////////////////////////////////////////////
//                                                          //
// Render function to draw the player's image.              //
//                                                          //
//////////////////////////////////////////////////////////////

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//////////////////////////////////////////////////////////////////////
//                                                                  //
// Handleinput function to take player direction from the keyboard. //
//                                                                  //
//////////////////////////////////////////////////////////////////////

Player.prototype.handleInput = function(direction) {

  this.tempX = this.x;
  this.tempY = this.y;

  switch(direction) {
    case "left":
      this.tempX = this.tempX - this.dx;
      break;
    case "right":
      this.tempX = this.tempX + this.dx;
      break;
    case "up":
      this.tempY = this.tempY - this.dy;
      break;
    case "down":
      this.tempY = this.tempY + this.dy;
      break;
  }
};

//////////////////////////////////////////////////////////////////////
// Now instantiate your objects.                                    //
//Place all enemy objects in an array called allEnemies             //
//Place the player object in a variable called player               //
//////////////////////////////////////////////////////////////////////

allEnemies = [];
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

var player = new Player();

//////////////////////////////////////////////////////////////////
//                                                              //
// This listens for key presses and sends the keys to your      //
// Player.handleInput() method. You don't need to modify this.  //
//                                                              //
//////////////////////////////////////////////////////////////////

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
