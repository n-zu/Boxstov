import { GunName } from "../../../common/guns";
import { Events } from "../../../common/observer/observer";

export type BulletInfo = {
  x: number;
  y: number;
  rotation: number;
  gunName: GunName;
  playerId: string;
};

export interface GameEvents extends Events {
  enemyKilled: (killerId: string) => void;
  shootBullet: (info: BulletInfo) => void;
};
