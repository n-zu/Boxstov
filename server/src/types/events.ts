import { GunName } from "../../../common/guns/gun";

export type BulletInfo = {
  x: number;
  y: number;
  rotation: number;
  gunName: GunName;
  playerId: string;
};

export type GameEvents = {
  playerReceivedDamage: (playerId: string) => void;
  unlockedGun: (playerId: string) => void;

  enemyReceivedDamage: (enemyId: number) => void;
  enemyKilled: (killerId: string) => void;
  shootBullet: (info: BulletInfo) => void;
  tick: () => void;
  gameEnd: () => void;
}
