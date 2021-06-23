const canvas = document.getElementById("myGame");
const ctx = canvas.getContext("2d");
const canvasScore = document.querySelector(".canvas__score");

class MyGame {
  constructor(canvas, ctx, func) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.func = func;
    this.play = setInterval(this.func, 10);

    this.speed = 15;
    this.score = 0;
    this.life = 0;
    this.x = this.canvas.width - 20;
    this.y = this.canvas.height;
    this.start = false;
    this.pause = true;
    this.collisionHandler = false;
    this.userName = "";
    this.key = new Date();
    this.color = "rgb(117, 117, 117)";
  }

  startGame() {
    const submitStart = document.querySelector(".canvas__form");
    if (this.pause) {
      clearInterval(this.play);
    }
    submitStart.onsubmit = (e) => {
      e.preventDefault();
      this.play = setInterval(this.func, 50);
      const input = document.querySelector(".canvas__input");
      const canvasForm = document.querySelector(".canvas__form");
      this.userName = input.value;
      canvasForm.classList.remove("active");
    };
  }

  collision(player, barrier) {
    if (
      barrier.x + barrier.width >= player.playerX &&
      barrier.x + barrier.width <= player.playerX + player.width &&
      barrier.y >= player.playerY &&
      barrier.y - barrier.height + 10 <=
        player.playerY - player.jumpHeight + player.height
    ) {
      this.collisionHandler = true;
      if (this.collisionHandler) {
        this.collisionHandler = false;
        this.life = this.life - 1 / 10;
        this.color = "red";
        setTimeout(() => {
          this.color = "rgb(117, 117, 117)";
          this.life = Math.floor(this.life);
        }, 100);
      }
    }
    if (
      barrier.x + barrier.width >= player.playerX &&
      barrier.x <= player.playerX
    ) {
      this.score = this.score + (1 / 3) * 10;
      setTimeout(() => {
        this.score = Math.round(this.score);
      }, 100);
    }
  }

  drawBackground() {
    const bg = new Image();
    bg.src = "./img/bg1.png";
    this.ctx.drawImage(bg, 0, 0, 1480, 520);
  }

  drawScore() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(`Score: ${this.score}`, 8, 20);
  }
  drawLife() {
    const life = new Image();
    const noLife = new Image();
    life.src = "./img/hearts_hud.png";
    noLife.src = "./img/no_hearts_hud.png";
    switch (this.life) {
      case 0:
        this.ctx.drawImage(life, 10, 40, 25, 25);
        this.ctx.drawImage(life, 40, 40, 25, 25);
        this.ctx.drawImage(life, 70, 40, 25, 25);
      case -1:
        this.ctx.drawImage(life, 10, 40, 25, 25);
        this.ctx.drawImage(life, 40, 40, 25, 25);
        this.ctx.drawImage(noLife, 70, 40, 25, 25);
      case -2:
        this.ctx.drawImage(life, 10, 40, 25, 25);
        this.ctx.drawImage(noLife, 40, 40, 25, 25);
        this.ctx.drawImage(noLife, 70, 40, 25, 25);
      case -3:
        this.ctx.drawImage(noLife, 10, 40, 25, 25);
        this.ctx.drawImage(noLife, 40, 40, 25, 25);
        this.ctx.drawImage(noLife, 70, 40, 25, 25);
    }
  }
}

class Player extends MyGame {
  constructor() {
    super(canvas, ctx);
    this.canvas = canvas;
    this.ctx = ctx;

    this.width = 50;
    this.height = 70;
    this.jumpCount = 0;
    this.jumpLength = 20;
    this.jumpHeight = 0;
    this.upPressed = false;
    this.downPressed = false;

    this.playerX = (this.canvas.width - this.width) / 5;
    this.playerY = this.canvas.height - this.height;

    this.img = new Image();
    this.numColumns = 8;
    this.numRows = 1;
    this.frameWidth = 2000 / this.numColumns;
    this.frameHeight = 98 / this.numRows;
    this.currentFrame = 0;
  }

  drawPlayer() {
    this.img.src = "./img/hero/newPlayer.png";
    this.currentFrame++;

    let maxFrame = this.numColumns * this.numRows - 1;
    if (this.currentFrame > maxFrame) {
      this.currentFrame = 0;
    }

    // jump
    let column = this.currentFrame % this.numColumns;
    let row = Math.floor(this.currentFrame / this.numColumns);
    if (this.upPressed) {
      this.img.src = "./img/hero/Jump.png";
      this.jumpCount++;
      this.jumpHeight =
        5 *
        this.jumpLength *
        Math.sin((Math.PI * this.jumpCount) / this.jumpLength);
    }
    if (this.jumpCount > this.jumpLength) {
      
      this.jumpCount = 0;
      this.upPressed = false;
      this.jumpHeight = 0;
    }
    // sit down

    this.ctx.drawImage(
      this.img,
      column * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.playerX,
      this.playerY - this.jumpHeight,
      this.frameWidth,
      this.frameHeight
    );
  }

  sitDown() {
    if (this.downPressed && !this.upPressed) {
      this.img.src = "./img/hero/sitdown.png";
      // this.height = 30;
      this.playerY = this.canvas.height - this.height;
    } else {
      // this.img.src = "./img/hero/newPlayer.png";
      this.height = 70;
      this.playerY = this.canvas.height - this.height;
    }
  }
}

class Barrier extends MyGame {
  constructor(barrierY, color, imgSrc) {
    super(canvas, ctx);
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 20;
    this.height = 20;
    this.x = this.canvas.width + 20;
    this.y = this.canvas.height - barrierY;
    this.color = color;

    this.img = new Image();
    this.imgSrc = imgSrc;
    this.numColumns = 8;
    this.numRows = 1;
    this.frameWidth = 128 / this.numColumns;
    this.frameHeight = 16 / this.numRows;
    this.currentFrame = 0;
  }
  drawBarrier() {
    this.img.src = this.imgSrc;
    this.currentFrame++;

    let maxFrame = this.numColumns * this.numRows - 1;
    if (this.currentFrame > maxFrame) {
      this.currentFrame = 0;
    }

    let column = this.currentFrame % this.numColumns;
    let row = Math.floor(this.currentFrame / this.numColumns);
    this.ctx.drawImage(
      this.img,
      column * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    // this.ctx.beginPath();
    // this.ctx.rect(this.x, this.y, this.width, this.height);
    // this.ctx.fillStyle = this.color;
    // this.ctx.fill();
    // this.ctx.closePath();
  }
}
const keyDownHandler = (e) => {
  // up arrow
  if (e.keyCode == 38) {
    player.upPressed = true;
  }
  // down arrow
  if (e.keyCode == 40) {
    player.downPressed = true;
  }
  //  esc
  if (e.keyCode == 27) {
    myGame.pause = true;
    clearInterval(myGame.play);
  }
  // enter
  if (e.keyCode == 13) {
    myGame.pause = false;
  }
  // space
  if (e.keyCode == 32) {
    myGame.pause = !myGame.pause;
    if (!myGame.pause) {
      myGame.play = setInterval(draw, 50);
    }
  }
};

const keyUpHandler = (e) => {
  if (e.keyCode == 40) {
    player.downPressed = false;
  }
};

const addUserScore = () => {
  canvasScore.classList.add("active");
  const result = JSON.parse(localStorage.getItem("result") || "[]");
  const user = {
    name: myGame.userName,
    score: Math.floor(myGame.score / 4) * 10,
    key: myGame.key,
  };
  result.push(user);
  const sortByField = (field) => {
    return (a, b) => (a[field] > b[field] ? -1 : 1);
  };
  result.sort(sortByField("score"));
  localStorage.setItem("result", JSON.stringify(result));

  result.forEach((item, index) => {
    const canvasScoreInner = document.querySelector(".canvas__score-inner");
    const listItem = document.createElement("p");
    if (index < 10) {
      listItem.innerHTML = `${index + 1}. ${item.name} - ${item.score}`;
    }
    if (index >= 10 && item.key == myGame.key) {
      listItem.innerHTML += `...</br>${index + 1}. ${item.name} - ${
        item.score
      }`;
    }
    canvasScoreInner.appendChild(listItem);
  });
};
const move = (b) => {
  b.x -= myGame.speed;
  if (b.x <= 0) {
    b.x = Math.floor(Math.random() * 1800 + 1500);
  }
  if (
    barrier.x + barrier.width + 200 >= barrier2.x &&
    barrier.x - 200 <= barrier2.x + barrier2.width
  ) {
    barrier.x += 300;
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  myGame.startGame();
  // myGame.drawBackground();

  player.drawPlayer();
  player.sitDown()

  barrier.drawBarrier();
  barrier2.drawBarrier();
  move(barrier);
  move(barrier2);

  myGame.drawScore();
  myGame.drawLife();

  myGame.collision(player, barrier);
  myGame.collision(player, barrier2);

  // if (myGame.life < -3) {
  //   clearInterval(myGame.play);
  //   addUserScore();
  // }
};

const myGame = new MyGame(canvas, ctx, draw);
const barrier = new Barrier(20, "#fac", "./img/enemy/1/enemy.png");
const barrier2 = new Barrier(70, "red", "./img/enemy/1/enemy.png");
const player = new Player();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
