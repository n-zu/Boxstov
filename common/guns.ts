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

export class Gun {
  public damage: number;
  public bulletSpeed: number;
  public bulletTexture: string;
  public reloadTime: number;

  constructor(
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

export const Guns: { [key in GunName]: Gun } = {
  [GunName.Rifle]: new Gun(30, 2000, "bullet", 100),
  [GunName.Shotgun]: new Gun(60, 1500, "shell", 300),
  [GunName.Rpg]: new Gun(200, 1000, "rocket", 600),
};
