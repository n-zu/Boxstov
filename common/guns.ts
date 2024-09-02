import { Direction } from "./types/direction.js";
import MovementDirection from "./controls/direction";

export enum GunName {
  Rifle = "rifle",
  Shotgun = "shotgun",
  Rpg = "rpg",
}

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

// FIXME: damage and bulletSpeed are not needed anymore, and should not be read from here
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
}

export class Rifle extends Gun {
  constructor() {
    super(10, 2000, "bullet", 100);
  }
}

export class Shotgun extends Gun {
  constructor() {
    super(10, 1500, "shell", 800);
  }
}

export class Rpg extends Gun {
  constructor() {
    super(200, 1000, "rocket", 1200);
  }
}

export const Guns: { [key in GunName]: Gun } = {
  [GunName.Rifle]: new Rifle(),
  [GunName.Shotgun]: new Shotgun(),
  [GunName.Rpg]: new Rpg()
};
