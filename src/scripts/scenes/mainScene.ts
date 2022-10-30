import { MultiplayerGame } from "../game/multiplayerGame";
import { World, WorldState } from "../objects/world";
import { GameMaster } from "../gameMaster/gameMaster";
import { Direction } from "../objects/player";
import Sprite = Phaser.Physics.Arcade.Sprite;

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
  Walk = "walk",
  Attack = "atk",
  Die = "die",
}

export function playAnimation(sprite: Sprite, actor: AnimationActor, direction: Direction, suffix: AnimationSuffix, startFrame?: number) {
  sprite.anims.play({
    key: `${actor}-${direction}-${suffix}`,
    startFrame: startFrame || 0
  }, true);
}

export default class MainScene extends Phaser.Scene {
  game: MultiplayerGame;
  world: World;
  gameMaster: GameMaster;
  syncCountdown = SYNC_COUNTDOWN;
  lastUpdated = Date.now();

  protected constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.createAnimations();
    this.add.tileSprite(0, 0, 7680, 4320, "tiles").setDepth(-9999);

    // FIXME: Need a way to get the ids

    this.world = new World(this, this.game.gameMaster);
    this.scene.launch("UIScene", this.world.players[0]);

    this.gameMaster = this.game.gameMaster;
  }

  public getState(): WorldState {
    return this.world.getState();
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    if (this.gameMaster.shouldSendSync()) {
      this.world.update();
      this.gameMaster.send("sync", this.world.getState());
    } else {
      this.world.playerControls.update();
    }
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

      this.createAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Walk, index * 16, index * 16 + 3, ZOMBIE_RUN_FRAMERATE);
      this.createAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Run, index * 16 + 4, index * 16 + 7, ZOMBIE_RUN_FRAMERATE);
      this.createAnimation(AnimationActor.Zombie, direction, AnimationSuffix.Attack, index * 16 + 8, index * 16 + 11, ZOMBIE_WALK_FRAMERATE);
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
