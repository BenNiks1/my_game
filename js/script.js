const canvas = document.getElementById("myGame");
const ctx = canvas.getContext("2d");
const canvasScore = document.querySelector(".canvas__score");

class MyGame {
  constructor(canvas, ctx, func) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.func = func;
    this.play = setInterval(this.func, 10);

    this.speed = 7;
    this.score = 0;
    this.life = 0;
    this.x = this.canvas.width - 20;
    this.y = this.canvas.height;
    this.start = false;
    this.pause = true;
    this.userName = "";
    this.key = new Date();
  }

  startGame() {
    const enterNameBtn = document.querySelector(".canvas__submit");
    if (this.pause) {
      clearInterval(this.play);
    }
    enterNameBtn.onclick = (e) => {
      e.preventDefault();

      const input = document.querySelector(".canvas__input");
      const canvasForm = document.querySelector(".canvas__form");
      this.userName = input.value;
      canvasForm.classList.remove("active");
      console.log(new Date());
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
      this.life = this.life - 1 / 10;
    } else if (
      barrier.x + barrier.width >= player.playerX &&
      barrier.x <= player.playerX
    ) {
      this.score++;
    }
  }

  drawScore() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#000";
    this.ctx.fillText("Score: " + Math.floor(this.score / 4) * 10, 8, 20);
  }
  drawLife() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#000";
    this.ctx.fillText("Life: " + Math.round(this.life + 3), 8, 40);
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
    this.jumpLength = 35;
    this.jumpHeight = 0;
    this.upPressed = false;
    this.downPressed = false;

    this.playerX = (this.canvas.width - this.width) / 5;
    this.playerY = this.canvas.height - this.height;
  }

  jump() {
    if (this.upPressed) {
      this.jumpCount++;
      this.jumpHeight =
        2 *
        this.jumpLength *
        Math.sin((Math.PI * this.jumpCount) / this.jumpLength);
    }
    if (this.jumpCount > this.jumpLength) {
      this.jumpCount = 0;
      this.upPressed = false;
      this.jumpHeight = 0;
    }
    this.status = true;
  }

  sitDown() {
    if (this.downPressed) {
      this.height = 30;
      this.playerY = this.canvas.height - this.height;
    } else {
      this.height = 70;
      this.playerY = this.canvas.height - this.height;
    }
  }

  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.rect(
      this.playerX,
      this.playerY - this.jumpHeight,
      this.width,
      this.height
    );
    this.ctx.fillStyle = "#000";
    this.ctx.fill();
    this.ctx.closePath();
  }
}

class Barrier extends MyGame {
  constructor(barrierY, color) {
    super(canvas, ctx);
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 20;
    this.height = 20;
    // this.x = this.canvas.width - 20;
    this.x = Math.round(Math.random() * (1400 - 1080) + 1080);
    this.y = this.canvas.height - barrierY;
    this.color = color;
  }
  drawBarrier() {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
  move(barrier) {
    this.x -= this.speed;
    if (barrier.x <= 0) {
      barrier.x = Math.round(Math.random() * (1400 - 1080) + 1080);
    }
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
    myGame.play = setInterval(draw, 10);
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
    if (index>=10&&item.key == myGame.key) {
      listItem.innerHTML += `...</br>${index + 1}. ${item.name} - ${
        item.score
      }`;
    }
    canvasScoreInner.appendChild(listItem);
  });
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  myGame.startGame();

  player.drawPlayer();
  player.jump();
  player.sitDown();
  barrier.drawBarrier();
  barrier2.drawBarrier();
  myGame.drawScore();
  myGame.drawLife();

  barrier.move(barrier);
  barrier2.move(barrier2);
  myGame.collision(player, barrier);
  myGame.collision(player, barrier2);

  if (myGame.life <= -3) {
    clearInterval(myGame.play);
    addUserScore();
  }
};
const myGame = new MyGame(canvas, ctx, draw);
const barrier = new Barrier(20, "#fac");
const barrier2 = new Barrier(70, "red");
const player = new Player();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
