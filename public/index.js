// const kaboom = require("kaboom");

// this will update the process.env with environment variables in .env file
// dotenv.config();
// initialize context
kaboom({
  width: 900,
  height: 550,
  font: "sinko",
  canvas: document.querySelector("#mycanvas"),
});

// load assets
// loadSprite("doc1", "sprites/bean.png")
loadSprite("corona3", "./sprites/corona3.png");
loadSprite("corona2", "./sprites/corona2.png");
loadSprite("doc1", "./sprites/doc1.png");
loadSprite("god", "./sprites/god.png");
loadSprite("satan", "./sprites/satan.png");

loadSprite("hospital", "./sprites/hospital.png");
loadSprite("jumpy", "./sprites/jumpy.png");
loadSprite("grass", "./sprites/grass.png");
loadSprite("portal", "./sprites/portal.png");
loadSprite("medicine", "./sprites/medicine.png");
loadSprite("meat", "./sprites/meat.png");

loadSound("hit", "./sounds/hit.mp3");
loadSound("shoot", "./sounds/shoot.mp3");
loadSound("explode", "./sounds/explode.mp3");
loadSound("medicine", "./sounds/score.mp3");
loadSound("powerup", "./sounds/powerup.mp3");
loadSound("OtherworldlyFoe", "./sounds/OtherworldlyFoe.mp3");
console.log("here !");
const JUMP_FORCE = 1000;
const MOVE_SPEED = 480;
const FALL_DEATH = 2000;

const LEVELS = [
  [
    "                                       ",
    "                   #       #          ",
    "                   <       <       < @",
    "                 = # = # = # = # = # =",
    "                 =     <       <       ",
    "                 =                    ",
    "              =                       ",
    "   =>####>=                           ",
    "xxxxxxxxxxxxxxxxxx       ",
  ],
];

layers(["bg", "ui", "game"], "ui");

function patrolX(speed = 40, dir = 1) {
  return {
    id: "patrol",
    require: ["pos", "area"],
    add() {
      this.on("collide", (obj, col) => {
        if (col.isLeft() || col.isRight()) {
          dir = -dir;
        }
      });
    },
    update() {
      this.move(speed * dir, 0);
    },
  };
}

function patrolY(speed = 40, dir = 1) {
  return {
    id: "patrol",
    require: ["pos", "area"],

    update() {
      this.move(0, speed * dir);
      // debug.log("pos : " + this.pos.y);
      if (this.pos.y > 220) {
        dir = -dir;
      } else if (this.pos.y < 20) {
        dir = -dir;
      }
    },
  };
}

const levelConf = {
  // grid size
  width: 60,
  height: 54,
  // define each object as a list of components
  "=": () => [sprite("grass"), area(), solid(), layer("game"), origin("bot")],
  x: () => [sprite("grass"), area(), solid(), layer("game"), origin("bot")],
  "#": () => [sprite("meat"), area(), scale(0.1), origin("bot"), "medicine"],
  "%": () => [
    sprite("prize"),
    area(),
    solid(),
    // scale(.4),
    origin("bot"),
    "prize",
  ],
  ">": () => [
    sprite("satan"),
    area(),
    solid(),
    scale(0.3),
    patrolX(),
    origin("center"),
    "corona",
  ],
  "<": () => [
    sprite("satan"),
    area(),
    solid(),
    scale(0.2),
    patrolY(),
    // pos(0,rand( 40,110 ) ),
    origin("center"),
    "corona",
  ],

  "@": () => [
    sprite("portal"),
    area({ scale: 0.5 }),
    origin("bot"),
    pos(0, -12),
    "portal",
  ],
};

scene("game", () => {
  const music = play("OtherworldlyFoe");
  let playMusic = true;

  gravity(3200);
  let coins = 0;

  const level = addLevel(LEVELS[0], levelConf);

  const doctor = add([
    sprite("god"),
    pos(50, 0),
    area(),
    scale(0.6),
    layer("bg"),
    // makes it fall to gravity and jumpable
    body(),
    // the custom component we defined above
    // big(),
    origin("bot"),
  ]);

  doctor.onUpdate(() => {
    camPos(doctor.pos.sub(50, 0));
    if (doctor.pos.y >= FALL_DEATH) {
      go("lose");
    }
  });

  doctor.onGround((objBelow) => {
    if (objBelow.is("corona")) {
      doctor.jump(JUMP_FORCE * 1.1);
      destroy(objBelow);
      addKaboom(doctor.pos);
      play("powerup");
    }
  });

  doctor.onCollide("corona", (e, col) => {
    // if it's not from the top, die
    if (!col.isBottom()) {
      music.stop();
      go("lose");
      play("hit");
    }
  });

  onKeyDown("left", () => {
    doctor.move(-MOVE_SPEED, 0);
  });

  onKeyDown("right", () => {
    doctor.move(MOVE_SPEED, 0);
  });

  onKeyPress("down", () => {
    doctor.weight = 3;
  });

  onKeyRelease("down", () => {
    doctor.weight = 1;
  });

  onKeyPress("s", () => {
    // fullscreen(!fullscreen())music
    // debug.log(" val ", playMusic);
    if (playMusic) {
      music.stop();
    } else {
      music.play();
    }
    playMusic = !playMusic;
  });

  onKeyPress("space", () => {
    // these 2 functions are provided by body() component
    if (doctor.isGrounded()) {
      doctor.jump(JUMP_FORCE);
    }
  });
  let medicinePitch = 0;

  onUpdate(() => {
    if (medicinePitch > 0) {
      medicinePitch = Math.max(0, medicinePitch - dt() * 100);
    }
  });

  doctor.onCollide("medicine", (c) => {
    destroy(c);
    play("medicine", {
      detune: medicinePitch,
    });
    medicinePitch += 100;
    coins += 1;
    coinsLabel.text = coins;
  });

  doctor.onCollide("portal", (c) => {
    go("win");
  });

  const coinsLabel = add([text(coins, { size: 48 }), pos(24, 24), fixed()]);
});

scene("lose", () => {
  add([text("You Lose\npress any key to\nplay ", { size: 48 })]);
  onKeyPress(() => go("game"));
});

scene("win", () => {
  add([
    pos(24, 24),
    text("You won level 1 congo !!", {
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

  onKeyPress(() => go("game"));
});

go("game");
