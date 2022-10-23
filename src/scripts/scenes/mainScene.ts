import { MultiplayerGame } from "../game/multiplayerGame";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";

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
      }, 500);
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
    this.load.image("bunny", "assets/bunny.png");
    this.load.image("tiles", "assets/Floor.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.spritesheet("player", "assets/run.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-idle", "assets/idle.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  createAnimations() {
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 8,
        end: 15,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 16,
        end: 23,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 32,
        end: 39,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 48,
        end: 55,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "up-idle",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right-idle",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 16,
        end: 23,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down-idle",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 32,
        end: 39,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left-idle",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 40,
        end: 47,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
