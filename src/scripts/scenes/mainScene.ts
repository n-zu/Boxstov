import { MultiplayerGame } from "../game/multiplayerGame";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster";
import { HostMaster } from "../hostMaster";
import { Direction } from "../objects/player";

const IDLE_FRAMERATE = 1;
const RUN_FRAMERATE = 10;
const ZOMBIE_WALK_FRAMERATE = 8;
const ZOMBIE_RUN_FRAMERATE = 8;


export enum AnimationActor {
  Player = "player",
  Zombie = "zombie",
}

export enum AnimationSuffix {
  Idle = "idle",
  Run = "run",
  Attack = "atk",
}

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  gameMaster: GameMaster;
  syncCountdown = 30;
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
        this.syncCountdown = 30;
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
      this.createMovementAnimation(AnimationActor.Player, direction, AnimationSuffix.Idle, index * 8, index * 8 + 1);
      this.createMovementAnimation(AnimationActor.Player, direction, AnimationSuffix.Run, index * 8 + 2, index * 8 + 7);

      this.createMovementAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Run, index * 16, index * 16 + 3, ZOMBIE_RUN_FRAMERATE);
      this.createMovementAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Idle, index * 16 + 4, index * 16 + 7, ZOMBIE_WALK_FRAMERATE);
      this.createAttackAnimation(AnimationActor.Zombie, direction, index * 16 + 8, index * 16 + 11);
    });

  }

  private createAttackAnimation(actor: AnimationActor, direction: Direction, startFrame: number, endFrame: number) {
    this.anims.create({
      key: `${actor}-${direction}-atk`,
      frames: this.anims.generateFrameNumbers(actor, {
        start: startFrame,
        end: endFrame
      }),
      frameRate: RUN_FRAMERATE,
      repeat: -1
    });
  }

  private createMovementAnimation(actor: AnimationActor, direction: Direction, suffix: AnimationSuffix, startFrame: number, endFrame: number, frameRate?: number) {
    let frameRateToUse = frameRate;
    if (suffix === AnimationSuffix.Run) {
      frameRateToUse = RUN_FRAMERATE;
    } else {
      frameRateToUse = IDLE_FRAMERATE;
    }

    this.anims.create({
      key: `${actor}-${direction}-${suffix}`,
      frames: this.anims.generateFrameNumbers(actor, {
        start: startFrame,
        end: endFrame
      }),
      frameRate: frameRateToUse,
      repeat: -1
    });

    this.anims.create({
      key: "zombie-down-left",
      frames: this.anims.generateFrameNumbers("zombie", {
        start: 112,
        end: 115
      }),
      frameRate: ZOMBIE_RUN_FRAMERATE,
      repeat: -1
    });
  }
}
