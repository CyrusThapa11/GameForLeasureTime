// initialize context
kaboom({
  width: 900,
  height: 550,
  font: "sinko",
  canvas: document.querySelector("#mycanvas"),
});

// load assets
loadSprite("flappy-background", "sprites/flappy-background.png");
loadSprite("butterfly", "sprites/doc1.png");
loadSprite("tower1", "sprites/tower1.png");
loadSprite("rect", "sprites/corona3.png");
layers(["game", "ui"], "game");

let highscore = 0;

scene("game", () => {
  let score = 0;

  const MOVE_SPEED = 200;
  const PIPE_GAP = 240;

  add([
    sprite("flappy-background", {
      width: width(),
      height: height(),
    }),
  ]);

  const scoreTest = add([text(score, { size: 50 })]);

  const player = add([
    sprite("butterfly", { height: 80, width: 80 }),
    pos(80, 30),
    area(),
    body(),
  ]);

  function producePipes() {
    const offset = rand(-20, 20);
    add([
      sprite("rect", { height: 70, width: 70 }),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      layer("ui"),
      scale(2.5),
      "pipe",
      area(),
      {
        passed: false,
      },
    ]);

    add([
      sprite("rect", { flipY: true }, { height: 70, width: 70 }),
      pos(width(), height() / 2 + offset - PIPE_GAP / 3),
      layer("ui"),
      origin("botleft"),
      scale(0.7),
      "pipe",
      area(),
    ]);
  }

  loop(2, () => {
    producePipes();
  });

  onUpdate("pipe", (pipe) => {
    pipe.move(-150, 0);

    if (pipe.passed == false && pipe.pos.x < player.pos.x) {
      score += 1;
      debug.log(score);
      pipe.passed = true;
      scoreTest.text = score;
    }

    if (player.pos.y + 30 > height() || player.pos.y < -30) {
      go("gameover", score);
    }
  });

  player.collides("pipe", () => {
    debug.log("collided");
    go("gameover", score);
  });

  keyPress("space", () => {
    player.jump(350);
  });

  loop(1, () => {
    if (time() > 10) {
      go("win");
    }
  });
});

scene("gameover", (score) => {
  if (score > highscore) {
    highscore = score;
  }

  add([
    text(
      "gameover !! \n " +
        " score is : " +
        score +
        "\n" +
        " highscore : " +
        highscore,
      {
        size: 48,
      }
    ),
  ]);

  keyPress("space", () => {
    go("game");
  });
});

scene("win", () => {
  add([
    pos(24, 24),
    text("You won level 3 congo !!", {
      size: 48,
      width: 320,
      font: "sink",
      color: rgb(0, 0, 255),
    }),
  ]);
  const btn = document.getElementById("btn");
  btn.disabled = false;

  onKeyPress("1", () => {
    go("docorona");
    debug.log("pressed 1");
  });
});

go("game");
