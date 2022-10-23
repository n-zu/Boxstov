import { MultiplayerGame } from "../game/multiplayerGame";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";

const IDLE_FRAMERATE = 1;
const RUN_FRAMERATE = 10;

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  gameMaster: GameMaster;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.createAnimations();

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
    this.load.image("bullet", "assets/bullet.png");
    this.load.spritesheet("player", "assets/Player/rifle_map.png", {
      frameWidth: 512,
      frameHeight: 512,
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
        start: 44,
        end: 49,
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
        start: 42,
        end: 43,
      }),
      frameRate: IDLE_FRAMERATE,
      repeat: -1,
    });
  }
}
