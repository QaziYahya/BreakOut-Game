class mainClass {
  constructor() {
    // Drawing Area
    this.canvas = document.querySelector('#canvas');
    // Get context
    this.ctx = canvas.getContext('2d');

    // Ball Info
    this.ball = {
      X: this.canvas.width / 2, // X Positon of the Ball
      Y: this.canvas.height / 2, // Y Positon of the Ball
      R: 10, // Radius of the Ball
      dx: 2,
      dy: -2,
    };

    // Paddle Info
    this.paddle = {
      X: this.canvas.width / 2 - 45, // X Position of the Paddle
      Y: this.canvas.height - 20, // Y Positon of the Paddle
      W: 175, // Paddle Width
      H: 15, // Paddle Height
    };

    // Brick Info
    this.brick = {
      X: 0,
      Y: 0,
      W: 105,
      H: 20,
      Padding: 25,
      OffSetLeft: 45,
      OffSetTop: 60,
    };

    // Used to check left and right button press
    this.rightPressed = false;
    this.leftPressed = false;

    // Brick Column and Row Count
    this.brickColumnCount = 8;
    this.brickRowCount = 5;

    // Used to hold the cordinates and visibility status of each brick
    this.bricks = [];

    // Used to save the score
    this.score = 0;

    // Initilize Bricks
    this.initBricks();
  }

  // Methods/Functions
  // Used to draw the ball on the screen
  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.ball.X, this.ball.Y, this.ball.R, 0, Math.PI * 2);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Used to draw the Paddle
  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.rect(this.paddle.X, this.paddle.Y, this.paddle.W, this.paddle.H);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Initilize the Bricks
  initBricks() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r] = { X: this.brick.X, Y: this.brick.Y, visible: true };
      }
    }
  }

  // Used to draw the bricks
  drawBricks() {
    // Loop through all the bricks
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        // Get the X and Y Position of each brick
        var brickX =
          c * (this.brick.W + this.brick.Padding) + this.brick.OffSetLeft;
        var brickY =
          r * (this.brick.H + this.brick.Padding) + this.brick.OffSetTop;

        /* Save the X and Y positions of the bricks they will be used in
        collision detection */
        this.bricks[c][r].X = brickX;
        this.bricks[c][r].Y = brickY;

        // Draw the bricks
        this.ctx.beginPath();
        this.ctx.rect(brickX, brickY, this.brick.W, this.brick.H);
        this.ctx.fillStyle = this.bricks[c][r].visible ? '#333' : 'transparent';
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }

  // Check for ball Collision
  checkBallCollision() {
    // Top Wall Check
    if (this.ball.Y - this.ball.R === 1) {
      this.ball.dy = 2;
    }
    // Bottom Wall Check
    if (this.ball.Y - this.ball.R === 641) {
      this.ball.dy = -2;
      /* If the ball hits the bottom wall then the user loses hence
      we reset the score and bricks */
      this.score = 0;
      this.initBricks();
      this.drawBricks();
    }
    // Right Wall Check
    if (this.ball.X - this.ball.R === 1092) {
      this.ball.dx = -2;
    }
    // Left Wall Check
    if (this.ball.X - this.ball.R === 2) {
      this.ball.dx = 2;
    }
    // Ball and Paddle collision check
    if (this.ball.Y === 631) {
      // If the ball is in the area of the paddle
      if (
        this.ball.X > this.paddle.X &&
        this.ball.X < this.paddle.X + this.paddle.W
      ) {
        this.ball.dy = -2;
      }
    }
  }

  // Used to move the ball
  moveBall() {
    this.ball.X += this.ball.dx;
    this.ball.Y += this.ball.dy;
  }

  // Used to Check Paddle Collision
  checkPaddleCollision() {
    // Right Wall Check
    if (this.paddle.X + this.paddle.W > this.canvas.width) {
      this.paddle.X = this.canvas.width - this.paddle.W;
    }
    // Left Wall Check
    if (this.paddle.X < 0) {
      this.paddle.X = 0;
    }
  }

  // Used to move the Paddle
  movePaddle() {
    // If right arrow key is pressed
    if (this.rightPressed) {
      this.paddle.X += 4;
      // If left arrow key is pressed
    } else if (this.leftPressed) {
      this.paddle.X -= 4;
    }
  }

  // Used to check brick collision
  checkBrickCollision() {
    // Loop through all the bricks
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        // If all these are true then
        if (
          this.ball.X + this.ball.R > this.bricks[c][r].X &&
          this.ball.X - this.ball.R < this.bricks[c][r].X + this.brick.W &&
          this.ball.Y + this.ball.R > this.bricks[c][r].Y &&
          this.ball.Y - this.ball.R < this.bricks[c][r].Y + this.brick.H
        ) {
          // If the brick is visible then
          if (this.bricks[c][r].visible) {
            // Bounce off the ball and make the brick disappear
            this.ball.dy *= -1;
            this.bricks[c][r].visible = false;
            // Increase the score since the brick was hit
            this.score++;
          }
        }
      }
    }
  }

  // Used to Calculate & Display Score
  calculateDisplayScore() {
    // If the scre is not equal to 40 then
    if (this.score !== 40) {
      this.ctx.font = '17px Arial';
      this.ctx.fillStyle = '#0095DD';
      this.ctx.fillText(`Score: ${this.score}`, 975, 35);

      // If the score is = 40 then the user won so reset the bricks and score
    } else {
      this.score = 0;
      window.location.reload();
    }
  }

  // Used to draw Everything on the Canvas
  draw() {
    // Clear the Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw the Ball
    this.drawBall();
    // Draw the Paddle
    this.drawPaddle();
    this.drawBricks();
    // Move the Ball
    this.moveBall();
    // Move the Paddle
    this.movePaddle();
    // Check Ball Collision
    this.checkBallCollision();
    // Check Paddle Collision
    this.checkPaddleCollision();
    // Check Brick Collision
    this.checkBrickCollision();
    // Calculate and Diaplay the score
    this.calculateDisplayScore();
  }
}

// Object of the class
const gameClass = new mainClass();

// Event listener for keyup and keydown
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Redraw everything after every 10 miliseconds
setInterval(() => {
  gameClass.draw();
}, 5);

// Executed when the key is down
function keyDownHandler(e) {
  // If right arrow key is pressed
  if (e.keyCode === 39) {
    gameClass.rightPressed = true;
    // If left arrow key is pressed
  } else if (e.keyCode === 37) {
    gameClass.leftPressed = true;
  }
}

// Executed when the key is up
function keyUpHandler(e) {
  // If right arrow key is pressed
  if (e.keyCode === 39) {
    gameClass.rightPressed = false;
    // If left arrow key is pressed
  } else if (e.keyCode === 37) {
    gameClass.leftPressed = false;
  }
}
