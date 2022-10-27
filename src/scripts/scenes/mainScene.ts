import { MultiplayerGame } from "../game/multiplayerGame";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";
import { Direction } from "../objects/player";

const IDLE_FRAMERATE = 1;
const RUN_FRAMERATE = 10;
const ATTACK_FRAMERATE = 10;
const DEATH_FRAMERATE = 10;
const ZOMBIE_WALK_FRAMERATE = 8;
const ZOMBIE_RUN_FRAMERATE = 8;

const SYNC_COUNTDOWN = 100;

export enum AnimationActor {
  Player = "player",
  Zombie = "zombie",
}

export enum AnimationSuffix {
  Idle = "idle",
  Run = "run",
  Attack = "atk",
  Die = "die",
}

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  gameMaster: GameMaster;
  syncCountdown = SYNC_COUNTDOWN;
  tileSprite: Phaser.GameObjects.TileSprite;

  protected constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.createAnimations();

    // FIXME: Need a way to get the ids

    this.world = new World(this, this.game.gameMaster);

    this.gameMaster = this.game.gameMaster;
  }

  public getState(): WorldState {
    return this.world.getState();
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    // FIXME: :(
    if (this.syncCountdown == 0) {
      if (this.gameMaster instanceof HostMaster) {
        this.gameMaster.send("sync", this.world.getState());
        this.syncCountdown = SYNC_COUNTDOWN;
      }
    } else {
      this.syncCountdown--;
    }
    this.world.update();
  }

  preload() {
    this.load.image("tiles", "assets/Floor.png");
    this.load.image("bullet", "assets/strip.png");
    this.load.spritesheet("player", "assets/Player/rifle_map.png", {
      frameWidth: 512,
      frameHeight: 512
    });
    this.load.spritesheet("zombie", "assets/Mobs/zombie_map_big.png", {
      frameWidth: 512,
      frameHeight: 512
    });
  }

  createAnimations() {
    const directions = [
      Direction.Down,
      Direction.DownRight,
      Direction.Right,
      Direction.UpRight,
      Direction.Up,
      Direction.UpLeft,
      Direction.Left,
      Direction.DownLeft
    ];

    directions.forEach((direction, index) => {
      this.createAnimation(AnimationActor.Player, direction, AnimationSuffix.Idle, index * 8, index * 8 + 1);
      this.createAnimation(AnimationActor.Player, direction, AnimationSuffix.Run, index * 8 + 2, index * 8 + 7);

      this.createAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Run, index * 16, index * 16 + 3, ZOMBIE_RUN_FRAMERATE);
      this.createAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Idle, index * 16 + 4, index * 16 + 7, ZOMBIE_WALK_FRAMERATE);
      this.createAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Attack, index * 16 + 8, index * 16 + 11);
    });

    const directionsDie = [
      Direction.Left,
      Direction.DownLeft,
      Direction.Down,
      Direction.DownRight,
      Direction.Right,
      Direction.UpRight,
      Direction.Up,
      Direction.UpLeft
    ];

    directionsDie.forEach((direction, index) => {
      this.createAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Die, index * 16 + 12, index * 16 + 15, DEATH_FRAMERATE);
    });

  }

  private createAnimation(actor: AnimationActor, direction: Direction, suffix: AnimationSuffix, startFrame: number, endFrame: number, frameRate?: number) {
    let frameRateToUse = frameRate;
    if (!frameRateToUse) {
      switch (suffix) {
        case AnimationSuffix.Idle:
          frameRateToUse = IDLE_FRAMERATE;
          break;
        case AnimationSuffix.Run:
          frameRateToUse = RUN_FRAMERATE;
          break;
        case AnimationSuffix.Attack:
          frameRateToUse = ATTACK_FRAMERATE;
          break;
        case AnimationSuffix.Die:
          frameRateToUse = DEATH_FRAMERATE;
          break;
      }
    }

    this.anims.create({
      key: `${actor}-${direction}-${suffix}`,
      frames: this.anims.generateFrameNumbers(actor, {
        start: startFrame,
        end: endFrame
      }),
      frameRate: frameRateToUse,
      repeat: suffix == AnimationSuffix.Die ? 0 : -1
    });
  }
}
