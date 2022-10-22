import { MultiplayerGame } from "../game/multiplayerGame";
import { Player } from "../objects/player";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  controlKeys: CursorKeys;
  gameMaster: GameMaster;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.createAnimations();

    // FIXME: Need a way to get the ids
    const id = Math.random().toString(36).substring(7);
    const player = new Player(this, 100, 100, id, this.game.gameMaster);
    this.world = new World(player, this, this.game.gameMaster);

    this.gameMaster = this.game.gameMaster;

    this.controlKeys = this.input.keyboard.createCursorKeys();

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
    // FIXME
    this.world.players[0].update(this.controlKeys);
  }

  preload() {
    this.load.image("bunny", "assets/bunny.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 24,
      frameHeight: 32,
    });
  }

  createAnimations() {
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 11,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 12,
        end: 23,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 24,
        end: 35,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 36,
        end: 47,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "up-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 0,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "right-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 12,
        end: 12,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "down-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 24,
        end: 24,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "left-idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 36,
        end: 36,
      }),
      frameRate: 30,
      repeat: -1,
    });
  }
}
