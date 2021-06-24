const canvas = document.getElementById("myGame");
const ctx = canvas.getContext("2d");
const canvasScore = document.querySelector(".canvas__score");

class MyGame {
  constructor(canvas, ctx, func) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.func = func;
    this.play = setInterval(this.func, 10);

    this.speed = 4;
    this.score = 0;
    this.life = 0;
    this.x = this.canvas.width - 20;
    this.y = this.canvas.height;
    this.start = false;
    this.pause = true;
    this.collisionHandler = false;
    this.userName = "";
    this.key = new Date();
    this.imgSrc = "./img/hero/newPlayer2.png";
  }

  startGame() {
    const submitStart = document.querySelector(".canvas__form");
    if (this.pause) {
      clearInterval(this.play);
    }
    submitStart.onsubmit = (e) => {
      e.preventDefault();
      this.play = setInterval(this.func, 10);
      const input = document.querySelector(".canvas__input");
      const canvasForm = document.querySelector(".canvas__form");
      this.userName = input.value;
      canvasForm.classList.remove("active");
    };
  }

  collision(player, barrier) {
    if (
      barrier.x + 15 + barrier.frameWidth - 25 >= player.playerX + 95 &&
      barrier.x + 15 + barrier.frameWidth - 25 <=
        player.playerX + 95 + player.frameWidth - 195 &&
      barrier.y + 55 >=
        player.playerY - player.jumpHeight + player.frameHeight - 80 &&
      barrier.y + 55 - barrier.frameHeight - 15 <=
        player.playerY - player.jumpHeight + player.frameHeight - 80
    ) {
      this.collisionHandler = true;
      this.imgSrc = "./img/hero/hit2.png";
      if (this.collisionHandler) {
        this.collisionHandler = false;
        this.life = this.life - 1 / 16;

        setTimeout(() => {
          this.imgSrc = "./img/hero/newPlayer2.png";
          this.life = Math.floor(this.life);
        }, 200);
      }
    } else if (
      barrier.x + 15 + barrier.frameWidth - 25 >= player.playerX + 95 &&
      barrier.x + 15 <= player.playerX + 95
    ) {
      this.score++;
    }
  }

  drawBackground() {
    let bgX = this.canvas.height - 1480
    

    const bg = new Image();
    bg.src = "./img/bg1.png";
    this.ctx.drawImage(bg,0,0,1480, 520 )

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
    this.jumpLength = 45;
    this.jumpHeight = 0;
    this.upPressed = false;
    this.downPressed = false;

    this.playerX = (this.canvas.width - this.width) / 5;
    this.playerY = this.canvas.height - 80;

    this.numColumns = 6;
    this.numRows = 8;
    this.frameWidth = 1500 / this.numColumns;
    this.frameHeight = 784 / this.numRows;
    this.currentFrame = 0;
  }

  drawPlayer() {
    const img = new Image();
    img.src = myGame.imgSrc;
    this.currentFrame++;

    let maxFrame = this.numColumns * this.numRows - 1;
    if (this.currentFrame > maxFrame) {
      this.currentFrame = 0;
    }

    let column = this.currentFrame % this.numColumns;
    let row = Math.floor(this.currentFrame / this.numColumns);

    // sit down
    if (this.downPressed && !this.upPressed) {
      myGame.imgSrc = "./img/hero/sitdown3.png";
      this.playerY = this.canvas.height + 40 - this.frameHeight;
    } else {
      myGame.imgSrc = "./img/hero/newPlayer2.png";
      this.playerY = this.canvas.height - this.height;
    }
    // jump
    if (this.upPressed) {
      myGame.imgSrc = "./img/hero/Jump2.png";
      this.jumpCount++;
      this.jumpHeight =
        2 *
        this.jumpLength *
        Math.sin((Math.PI * this.jumpCount) / this.jumpLength);
    }
    if (this.jumpCount > this.jumpLength) {
      myGame.imgSrc = "./img/hero/newPlayer2.png";
      this.jumpCount = 0;
      this.upPressed = false;
      this.jumpHeight = 0;
    }
    // drawImage
    this.ctx.drawImage(
      img,
      column * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.playerX,
      this.playerY - this.jumpHeight,
      this.frameWidth,
      this.frameHeight - 15
    );
  }
}

class Barrier extends MyGame {
  constructor(imgSrc, imgWidth, imgHeight, numColumns, numRows, barrierY) {
    super(canvas, ctx);
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 50;
    this.height = 80;
    this.x = this.canvas.width + 20;
    this.y = this.canvas.height - barrierY;

    this.img = new Image();
    this.imgSrc = imgSrc;
    this.imgWidth = imgWidth;
    this.imgHeight = imgHeight;
    this.numColumns = numColumns;
    this.numRows = numRows;
    this.frameWidth = this.imgWidth / this.numColumns;
    this.frameHeight = this.imgHeight / this.numRows;
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
      this.frameWidth,
      this.frameHeight
    );
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
      myGame.play = setInterval(draw, 10);
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
    score: myGame.score,
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
  myGame.drawBackground()
  player.drawPlayer();

  barrier.drawBarrier();
  barrier2.drawBarrier();
  move(barrier);
  move(barrier2);

  myGame.drawScore();
  myGame.drawLife();

  myGame.collision(player, barrier);
  myGame.collision(player, barrier2);

  if (myGame.life < -3) {
    clearInterval(myGame.play);
    addUserScore();
  }
};

const myGame = new MyGame(canvas, ctx, draw);
const barrier = new Barrier("./img/enemy/1/enemy.png", 384, 480, 6, 6, 65);
const barrier2 = new Barrier("./img/enemy/1/enemy.png", 384, 480, 6, 6, 105);
const player = new Player();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
