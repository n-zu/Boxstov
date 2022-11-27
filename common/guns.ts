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
