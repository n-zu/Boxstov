import { EnemyModel } from "../enemy/enemyModel";
import { GunName } from "../guns/gun";
import PlayerModel from "../playerModel";
import { UnitVector } from "./direction";

export type BulletInfo = {
  x: number;
  y: number;
  rotation: number;
  gunName: GunName;
  playerId: string;
};

export type GameEvents = {
  /// Local player wants to change gun
  triggerChangeGun: (name: GunName) => void;
  /// Local player wants to move in a direction
  triggerMove: (direction: UnitVector) => void;
  /// Local player wants to shoot
  triggerShoot: () => void;
  /// Some player has shot
  playerShoot: (player: PlayerModel) => void;
  /// Some player has joined the game
  newPlayer: (player: PlayerModel) => void;
  /// Some player has updated its state
  playerUpdate: (player: PlayerModel) => void;
  /// Some player has died
  playerDied: (player: PlayerModel) => void;
  /// Some player has killed an enemy
  playerKill: (player: PlayerModel) => void;
  /// Some player has left the game
  playerLeft: (player: PlayerModel) => void;
  /// Some player has switched gun
  playerSwitchedGun: (player: PlayerModel) => void;
  /// Some player has unlocked a gun
  playerUnlockedGun: (player: PlayerModel) => void;
  /// Some player has received damage
  playerReceivedDamage: (player: PlayerModel) => void;
  /// Some player has stopped moving
  playerStoppedMoving: (player: PlayerModel) => void;

  /// Some enemy has received damage
  enemyReceivedDamage: (enemy: EnemyModel) => void;

  tick: () => void;

  gameEnd: () => void;
};