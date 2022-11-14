import { Direction } from "../../../common/types/direction";
import { WorldState } from "../../../common/types/state";
import { MultiplayerGame } from "../game/multiplayerGame";
import { World } from "../objects/world";
import Sprite = Phaser.GameObjects.Sprite;

const IDLE_FRAMERATE = 1;
const RUN_FRAMERATE = 10;
const ATTACK_FRAMERATE = 10;
const DEATH_FRAMERATE = 10;
const ZOMBIE_WALK_FRAMERATE = 8;
const ZOMBIE_RUN_FRAMERATE = 8;

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

export function playAnimation(
  sprite: Sprite,
  actor: AnimationActor,
  direction: Direction,
  suffix: AnimationSuffix,
  startFrame?: number
) {
  sprite.anims.play(
    {
      key: `${actor}-${direction}-${suffix}`,
      startFrame: startFrame || 0,
    },
    true
  );
}

export default class MainScene extends Phaser.Scene {
  declare game: MultiplayerGame;
  // @ts-ignore
  world: World;
  // @ts-ignore
  gameMaster: GameMaster;
  uiCamera?: Phaser.Cameras.Scene2D.Camera;

  protected constructor() {
    super({ key: "MainScene" });
  }

  setupCameras() {
    const camera = this.cameras.main;
    const uiCamera = this.cameras.add(0, 0, camera.width, camera.height);
    this.uiCamera = uiCamera;

    const add_existing = this.add.existing;
    this.add.existing = function (...params): any {
      const elem: any = add_existing.call(this, ...params);
      uiCamera.ignore(elem);
      return elem;
    };

    const add_tile_sprite = this.add.tileSprite;
    this.add.tileSprite = function (...params): any {
      const elem: any = add_tile_sprite.call(this, ...params);
      uiCamera.ignore(elem);
      return elem;
    };

    const add_text = this.add.text;
    this.add.text = function (...params): any {
      const elem: any = add_text.call(this, ...params);
      camera.ignore(elem);
      return elem;
    };
  }

  create() {
    this.setupCameras();
    this.game = this.game as MultiplayerGame;
    this.gameMaster = this.game.gameMaster;
    this.world = new World(this, this.game.gameMaster);

    this.uiCamera?.ignore(this.world.bulletGroup);

    this.createAnimations();
    this.add.tileSprite(0, 0, 7680, 4320, "tiles").setDepth(-9999);
  }

  public sync(worldState: WorldState) {
    this.world.sync(worldState);
  }

  update() {
    this.world.update();
  }

  preload() {
    this.load.image("tiles", "assets/Floor.png");
    this.load.image("bullet", "assets/strip.png");
    this.load.spritesheet("player", "assets/Player/rifle_map.png", {
      frameWidth: 512,
      frameHeight: 512,
    });
    this.load.spritesheet("zombie", "assets/Mobs/zombie_map.png", {
      frameWidth: 512,
      frameHeight: 512,
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
      Direction.DownLeft,
    ];

    directions.forEach((direction, index) => {
      this.createAnimation(
        AnimationActor.Player,
        direction,
        AnimationSuffix.Idle,
        index * 8,
        index * 8 + 1
      );
      this.createAnimation(
        AnimationActor.Player,
        direction,
        AnimationSuffix.Run,
        index * 8 + 2,
        index * 8 + 7
      );

      this.createAnimation(
        AnimationActor.Zombie,
        direction,
        AnimationSuffix.Walk,
        index * 16,
        index * 16 + 3,
        ZOMBIE_RUN_FRAMERATE
      );
      this.createAnimation(
        AnimationActor.Zombie,
        direction,
        AnimationSuffix.Run,
        index * 16 + 4,
        index * 16 + 7,
        ZOMBIE_RUN_FRAMERATE
      );
      this.createAnimation(
        AnimationActor.Zombie,
        direction,
        AnimationSuffix.Attack,
        index * 16 + 8,
        index * 16 + 11,
        ZOMBIE_WALK_FRAMERATE
      );
    });

    const directionsDie = [
      Direction.Left,
      Direction.DownLeft,
      Direction.Down,
      Direction.DownRight,
      Direction.Right,
      Direction.UpRight,
      Direction.Up,
      Direction.UpLeft,
    ];

    directionsDie.forEach((direction, index) => {
      this.createAnimation(
        AnimationActor.Zombie,
        direction,
        AnimationSuffix.Die,
        index * 16 + 12,
        index * 16 + 15,
        DEATH_FRAMERATE
      );
    });
  }

  private createAnimation(
    actor: AnimationActor,
    direction: Direction,
    suffix: AnimationSuffix,
    startFrame: number,
    endFrame: number,
    frameRate?: number
  ) {
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
        end: endFrame,
      }),
      frameRate: frameRateToUse,
      repeat: suffix == AnimationSuffix.Die ? 0 : -1,
    });
  }
}
