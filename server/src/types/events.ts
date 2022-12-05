import { GunName } from "../../../common/guns";
import { Events } from "../../../common/observer/observer";

export type BulletInfo = {
  x: number;
  y: number;
  rotation: number;
  gunName: GunName;
  playerId: string;
};

export type GameEvents = {
  enemyKilled: (killerId: string) => void;
  shootBullet: (info: BulletInfo) => void;
}
