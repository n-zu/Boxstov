import { Direction } from "./types/direction.js";
import MovementDirection from "./controls/direction";

export enum GunName {
  Rifle = "rifle",
  Shotgun = "shotgun",
  Rpg = "rpg",
}

const GUN_OFFSETS = {
  "moving": {
    [Direction.Right]: [200, -95],
    [Direction.Left]: [-170, -110],
    [Direction.Up]: [10, -230],
    [Direction.Down]: [-12, 50],
    [Direction.UpLeft]: [-135, -185],
    [Direction.UpRight]: [150, -180],
    [Direction.DownLeft]: [-175, -10],
    [Direction.DownRight]: [150, -10]
  },
  "idle": {
    [Direction.Right]: [200, -105],
    [Direction.Left]: [-170, -120],
    [Direction.Up]: [15, -230],
    [Direction.Down]: [-20, 40],
    [Direction.UpLeft]: [-125, -195],
    [Direction.UpRight]: [150, -180],
    [Direction.DownLeft]: [-180, -30],
    [Direction.DownRight]: [150, -20]
  }
};

const GUN_ROTATIONS = {
  [Direction.Right]: 0,
  [Direction.Left]: Math.PI,
  [Direction.Up]: -Math.PI / 2,
  [Direction.Down]: Math.PI / 2,
  [Direction.UpLeft]: -3 * Math.PI / 4 - 0.3,
  [Direction.UpRight]: -Math.PI / 4 + 0.3,
  [Direction.DownLeft]: 3 * Math.PI / 4 + 0.3,
  [Direction.DownRight]: Math.PI / 4 - 0.3
};

export const numToGunName = (num: number): GunName => {
  switch (num) {
    case 0:
      return GunName.Rifle;
    case 1:
      return GunName.Shotgun;
    case 2:
      return GunName.Rpg;
    default:
      return GunName.Rifle;
  }
};

export abstract class Gun {
  public damage: number;
  public bulletSpeed: number;
  public bulletTexture: string;
  public reloadTime: number;

  protected constructor(
    damage: number,
    bulletSpeed: number,
    bulletTexture: string,
    reloadTime: number
  ) {
    this.damage = damage;
    this.bulletSpeed = bulletSpeed;
    this.bulletTexture = bulletTexture;
    this.reloadTime = reloadTime;
  }

  public getGunOffset(movementDirection: MovementDirection): [number, number] {
    if (!movementDirection.isMoving()) {
      return GUN_OFFSETS.idle[movementDirection.getFacingDirection()] as [number, number];
    } else {
      return GUN_OFFSETS.moving[movementDirection.getFacingDirection()] as [number, number];
    }
  }

  public getGunRotation(movementDirection: MovementDirection): number {
    return GUN_ROTATIONS[movementDirection.getFacingDirection()] as number;
  }

  public abstract playSound(volume: number): void;
}

export class Rifle extends Gun {
  constructor() {
    super(30, 2000, "bullet", 100);
  }

  public playSound(volume: number): void {
    const aud = new Audio("assets/audio/rifle.mp3");
    aud.volume = volume;
    aud.play();
  }
}

export class Shotgun extends Gun {
  constructor() {
    super(60, 1500, "shell", 800);
  }

  public playSound(volume: number): void {
    const aud = new Audio("assets/audio/shotgun.mp3");
    aud.volume = volume;
    aud.play();
  }
}

export class Rpg extends Gun {
  constructor() {
    super(200, 1000, "rocket", 1200);
  }

  public playSound(volume: number): void {
    const aud = new Audio("assets/audio/rpg.mp3");
    aud.volume = volume;
    aud.play();
  }
}

export const Guns: { [key in GunName]: Gun } = {
  [GunName.Rifle]: new Rifle(),
  [GunName.Shotgun]: new Shotgun(),
  [GunName.Rpg]: new Rpg()
};
