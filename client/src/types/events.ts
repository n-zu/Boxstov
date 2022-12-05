import { GunName } from "../../../common/guns";
import { UnitVector } from "../../../common/types/direction";
import { Player } from "../objects/player";
import { Enemy } from "../objects/enemy";

export type GameEvents = {
  /// Local player wants to change gun
  triggerChangeGun: (name: GunName) => void;
  /// Local player wants to move in a direction
  triggerMove: (direction: UnitVector) => void;
  /// Local player wants to shoot
  triggerShoot: () => void;
  /// Some player has shot
  playerShoot: (player: Player) => void;
  /// Some player has joined the game
  newPlayer: (player: Player) => void;
  /// Some player has updated its state
  playerUpdate: (player: Player) => void;
  /// Some player has died
  playerDied: (player: Player) => void;
  /// Some player has killed an enemy
  playerKill: (player: Player) => void;
  /// Some player has left the game
  playerLeft: (player: Player) => void;
  /// Some player has switched gun
  playerSwitchedGun: (player: Player) => void;
  /// Some player has unlocked a gun
  playerUnlockedGun: (player: Player) => void;
  /// Some player has received damage
  playerReceivedDamage: (player: Player) => void;
  /// Some enemy has received damage
  enemyReceivedDamage: (enemy: Enemy) => void;
};
