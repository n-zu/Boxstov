import { GunName } from "./guns.js";

export const ENEMY_GROUP_MAX = 20;

export const GAME_WIDTH = 5000;
export const GAME_HEIGHT = 5000;
export const MS_BETWEEN_SYNCS = 25;
export const KILLS_TO_UNLOCK = {
  [GunName.Rifle]: 0,
  [GunName.Shotgun]: 10,
  [GunName.Rpg]: 50,
};

export const WORLD_BOUNDS = [
  -GAME_WIDTH / 2,
  -GAME_HEIGHT / 2,
  GAME_WIDTH,
  GAME_HEIGHT,
] as const;
