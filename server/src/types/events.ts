import { GunName } from "../../../common/guns";

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
  tick: () => void;
  gameEnd: () => void;
}
