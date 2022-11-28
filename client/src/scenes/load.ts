// No importar otras escenas de manera estática, la idea de este script es que
// cargue rápido asi se muestra la pantalla de carga rápido
import Phaser from "phaser";
import { Direction } from "../../../common/types/direction";
import { GuestMaster } from "../gameMaster/guestMaster";
import { AnimationActor, AnimationSuffix } from "../types/animation";

// Imports de las escenas, se hacen desde acá para que se carguen durante la
// pantalla de carga y ya queden cacheadas para después.

export function loadGameAssets(scene: Phaser.Scene) {
  scene.load.image("tiles", "assets/Floor.png");
  scene.load.image("bullet", "assets/strip.png");
  scene.load.spritesheet("player", "assets/Player/rifle_map.png", {
    frameWidth: 512,
    frameHeight: 512,
  });
  scene.load.spritesheet("zombie", "assets/Mobs/zombie_map.png", {
    frameWidth: 512,
    frameHeight: 512,
  });
}

export function loadMenuAssets(scene: Phaser.Scene) {
  scene.load.image("squares", "assets/img/background.png");
  scene.load.image("logo", "assets/img/logo.png");
  scene.load.html("input", "html/input.html");
}

export function loadSpinnerAssets(scene: Phaser.Scene) {
  scene.load.spritesheet("spinner", "assets/img/spinner.png", {
    frameWidth: 200,
    frameHeight: 200,
  });
}

export function loadUIAssets(scene: Phaser.Scene) {
  scene.load.image("invite", "assets/img/invite.png");
}

const IDLE_FRAMERATE = 1;
const RUN_FRAMERATE = 10;
const ATTACK_FRAMERATE = 10;
const DEATH_FRAMERATE = 10;
const ZOMBIE_WALK_FRAMERATE = 8;
const ZOMBIE_RUN_FRAMERATE = 8;

const PROGRESS_WIDTH = 320;
const PROGRESS_HEIGHT = 50;
const PROGRESS_PADDING = 10;
const INNER_WIDTH = PROGRESS_WIDTH - PROGRESS_PADDING * 2;
const INNER_HEIGHT = PROGRESS_HEIGHT - PROGRESS_PADDING * 2;

export type MenuData = {
  guestMaster: GuestMaster;
};

export default class LoadScene extends Phaser.Scene {
  guestMaster?: GuestMaster;

  constructor() {
    super({ key: "Loading" });
  }

  create({ guestMaster }: MenuData) {
    this.guestMaster = guestMaster;
  }

  preload() {
    let menu = import("./menu");
    this.loadingBar(() => {
      console.log("Loaded all assets!");
      this.createAnimations();
      menu.then(({ default: menu }) => {
        console.log("Loaded scripts!");
        this.scene.stop();
        this.scene.add("Menu", menu, true, { guestMaster: this.guestMaster });
      });
    });
    loadGameAssets(this);
    loadMenuAssets(this);
    loadSpinnerAssets(this);
    loadUIAssets(this);
  }

  private loadingBar(onComplete: () => void) {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    const startX = this.cameras.main.centerX - PROGRESS_WIDTH / 2;
    const startY = this.cameras.main.centerY - PROGRESS_HEIGHT / 2;
    progressBox.fillRect(startX, startY, PROGRESS_WIDTH, PROGRESS_HEIGHT);

    const loadingText = this.make.text({
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2 - 50,
      text: "Loading...",
      style: {
        font: "24px monospace",
      },
    });
    loadingText.setOrigin(0.5);

    this.load.on("progress", function (value: number) {
      const innerStartX = startX + PROGRESS_PADDING;
      const innerStartY = startY + PROGRESS_PADDING;
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        innerStartX,
        innerStartY,
        INNER_WIDTH * value,
        INNER_HEIGHT
      );
    });
    this.load.on("complete", onComplete);
  }

  private createAnimations() {
    this.anims.create({
      key: "spinner",
      frames: this.anims.generateFrameNumbers("spinner", {
        start: 0,
        end: 50,
      }),
      frameRate: 30,
      repeat: -1,
    });

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
