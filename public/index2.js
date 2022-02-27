// import kaboom from "kaboom";

// initialize context
kaboom({
  width: 900,
  height: 550,
  font: "sinko",
  canvas: document.querySelector("#mycanvas"),
});

// load assets
loadSprite("corona1", "./sprites/satan.png");
loadSprite("doc1", "./sprites/god.png");
loadSprite("earth", "./sprites/earth2.gif");
loadSprite("corona2", "./sprites/satan.png");
loadSprite("corona3", "./sprites/satan.png");

loadSound("hit", "./sounds/hit.mp3");
loadSound("shoot", "./sounds/shoot.mp3");
loadSound("explode", "./sounds/explode.mp3");
loadSound("OtherworldlyFoe", "./sounds/OtherworldlyFoe.mp3");
loadSprite("god", "./sprites/god.png");
loadSprite("satan", "./sprites/satan.png");
loadSprite("meat", "./sprites/meat.png");

let highscore = 0;

layers(["bg", "ui"], "bg");

scene("docorona", () => {
  const DOC_SPEED = 200;
  const COR_SPEED = 350;
  const BULLET_SPEED = 200;
  const HEALTH_CORONA1 = 5;
  const HEALTH_CORONA2 = 4;
  const HEALTH_CORONA3 = 3;
  const COR_SPEED1 = 30;
  const COR_SPEED2 = 40;
  const COR_SPEED3 = 50;

  // add([sprite("earth"), layer("ui"), scale(0.4)]);

  const music = play("OtherworldlyFoe");

  const doctor = add([
    // list of components
    sprite("doc1"),
    layer("bg"),
    pos(60, height() / 2),
    scale(0.6),
    area(),
    rotate(20),
    origin("center"),
    "doctor",
  ]);

  function grow(rate) {
    return {
      update() {
        const n = rate * dt();
        this.scale.x += n;
        this.scale.y += n;
      },
    };
  }

  function addExplode(p, n, rad, size) {
    for (let i = 0; i < n; i++) {
      wait(rand(n * 0.1), () => {
        for (let i = 0; i < 2; i++) {
          add([
            pos(p.add(rand(vec2(-rad), vec2(rad)))),
            rect(4, 4),
            outline(4),
            scale(1 * size, 1 * size),
            lifespan(0.1),
            grow(rand(48, 72) * size),
            origin("center"),
          ]);
        }
      });
    }
  }

  function produceCorona1() {
    const position = rand(30, height() - 30);

    const cor = add([
      sprite("corona1"),
      pos(width() - 50, position),
      health(HEALTH_CORONA1),
      scale(0.34),
      area(),
      "corona",
      {
        killed: false,
        speed: COR_SPEED1,
      },
    ]);

    cor.on("hurt", () => {
      // debug.log("hurt kiya1");
    });

    cor.on("death", () => {
      destroy(cor);
    });
  }

  function produceCorona2() {
    const position = rand(30, height() - 30);

    const cor = add([
      sprite("corona2"),
      health(HEALTH_CORONA2),
      pos(width() - 50, position),
      scale(0.44),
      area(),
      "corona",
      {
        killed: false,
        speed: COR_SPEED2,
      },
    ]);

    cor.on("hurt", () => {
      // debug.log("hurt kiya2");
    });

    cor.on("death", () => {
      destroy(cor);
    });
  }

  function produceCorona3() {
    const position = rand(30, height() - 30);

    const cor = add([
      sprite("corona3"),
      health(HEALTH_CORONA3),
      pos(width() - 50, position),
      scale(0.54),
      area(),
      "corona",
      {
        killed: false,
        speed: COR_SPEED3,
      },
    ]);
    cor.on("hurt", () => {
      // debug.log("Ouch !");
    });

    cor.on("death", () => {
      destroy(cor);
    });
  }

  if (time() <= 13) {
    debug.log("time->", time());
    loop(0.5, () => {
      produceCorona1();
      if (time() > 12) {
        go("win");
      }
    });
    loop(1.5, () => {
      produceCorona2();
    });

    loop(2.5, () => {
      produceCorona3();
    });
  } else {
    go("win");
  }

  onUpdate("corona", (corona) => {
    corona.move(-corona.speed, 0);
  });

  doctor.collides("corona", () => {
    go("gameover");
  });
  on("death", "corona", (e) => {
    destroy(e);
    shake(2);
    addKaboom(e.pos);
  });

  keyDown("up", () => {
    // debug.log( doctor.angle  )
    doctor.move(0, -DOC_SPEED);
    if (doctor.pos.y < 0) {
      doctor.pos.y = height();
    }
  });

  keyDown("down", () => {
    // debug.log("keypress");
    doctor.move(0, +DOC_SPEED);
    if (doctor.pos.y > height()) {
      doctor.pos.y = 0;
    }
  });

  function spawnBullet(p) {
    add([
      rect(48, 12),
      area(),
      pos(p),
      origin("center"),
      color(173, 216, 230),
      outline(2),
      move(RIGHT, BULLET_SPEED),
      cleanup(),
      "bullet",
    ]);
  }

  onKeyPress("space", () => {
    spawnBullet(doctor.pos);
  });

  onCollide("bullet", "corona", (b, c) => {
    destroy(b);
    c.hurt(2);
    addExplode(b.pos, 1, 24, 1);
  });

  onCollide("doctor", "corona", (d, c) => {
    destroy(d);
    destroy(c);
  });

  on("hurt", "corona", (e) => {
    shake(1);
    play("hit", {
      detune: rand(-1200, 1200),
      speed: rand(0.2, 2),
    });
  });
});

go("docorona");

scene("gameover", () => {
  onKeyPress("1", () => {
    go("docorona");
    debug.log("pressed 1");
  });
});

scene("win", () => {
  add([
    pos(24, 24),
    text("You won level 2 congo !!", {
      size: 48,
      width: 320,
      font: "sink",
      color: rgb(0, 0, 255),
    }),
  ]);
  const btn = document.getElementById("btn1");
  const btn2 = document.getElementById("btn2");
  btn.style.display = "inline";
  btn2.style.display = "inline";
  onKeyPress("1", () => {
    go("docorona");
    debug.log("pressed 1");
  });
});
