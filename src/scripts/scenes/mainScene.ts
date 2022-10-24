import { MultiplayerGame } from "../game/multiplayerGame";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";

const IDLE_FRAMERATE = 1;
const RUN_FRAMERATE = 10;
const ZOMBIE_RUN_FRAMERATE = 8;

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  gameMaster: GameMaster;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.createAnimations();

    const factor = 3;
    this.add
      .tileSprite(150, 100, 300 * factor, 200 * factor, "tiles")
      .setScale(1 / factor);

    // FIXME: Need a way to get the ids

    this.world = new World(this, this.game.gameMaster);

    this.gameMaster = this.game.gameMaster;

    // FIXME: :(
    if (this.gameMaster instanceof HostMaster) {
      setInterval(() => {
        this.gameMaster.send("sync", this.world.getState());
      }, 1000);
    }
  }

  public getState(): WorldState {
    return this.world.getState();
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    this.world.update();
  }

  preload() {
    this.load.image("tiles", "assets/Floor.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.spritesheet("player", "assets/Player/rifle_map.png", {
      frameWidth: 512,
      frameHeight: 512,
    });
    this.load.spritesheet("zombie", "assets/Mobs/zombie_map_big.png", {
      frameWidth: 512,
      frameHeight: 512,
    });
  }

  createAnimations() {
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 34,
        end: 39,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 18,
        end: 23,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 2,
        end: 7,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 50,
        end: 55,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "up-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 26,
        end: 31,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "up-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 43,
        end: 47,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "down-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 10,
        end: 15,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "down-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 58,
        end: 63,
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "up-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 32,
        end: 33,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "right-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 16,
        end: 17,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "down-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 1,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "left-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 48,
        end: 49,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "up-right-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 24,
        end: 25,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "up-left-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 41,
        end: 42,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "down-right-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 8,
        end: 9,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "down-left-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 56,
        end: 57,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });

    // Zombie animations
    this.anims.create({
      key: "zombie-up",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 64,
        end: 69,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie-right",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 20,
        end: 23,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie-down",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 4,
        end: 7,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie-left",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 96,
        end: 99,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie-up-right",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 48,
        end: 51,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie-up-left",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 80,
        end: 83,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie-down-right",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 16,
        end: 19,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "zombie-down-left",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 112,
        end: 115,
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1,
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", {
        start: 2,
        end: 4,
      }),
      frameRate: 200,
      repeat: 0,
    });
  }
}
