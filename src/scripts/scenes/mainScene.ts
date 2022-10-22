import { MultiplayerGame } from "../game/multiplayerGame";
import { Player } from "../objects/player";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";
import { PlayerControls } from "../objects/playerControls";

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  playerControls: PlayerControls;
  gameMaster: GameMaster;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.createAnimations();

    // FIXME: Need a way to get the ids
    const id = Math.random().toString(36).substring(7);
    const player = new Player(this, 100, 100, id, this.game.gameMaster);

    this.playerControls = new PlayerControls(player);
    this.world = new World(player, this, this.game.gameMaster);

    this.gameMaster = this.game.gameMaster;

    // FIXME: :(
    if (this.gameMaster instanceof HostMaster) {
      setInterval(() => {
        this.gameMaster.send("sync", this.world.getState());
      }, 500);

      this.gameMaster.addAction("newPlayer", (data) => {
        const id = data.id;
        this.world.players.push(
          new Player(this, 100, 100, id, this.game.gameMaster)
        );
      });
    } else {
      this.gameMaster.send("newPlayer", { id: id });
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
    this.playerControls.update();
  }

  preload() {
    this.load.image("bunny", "assets/bunny.png");
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
