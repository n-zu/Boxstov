import { GunName } from "../../../common/guns";
import { Events } from "../../../common/observer/observer";
import { UnitVector } from "../../../common/types/direction";
import { Player } from "../objects/player";

export interface GameEvents extends Events {
  changeGun: (name: GunName) => void;
  playerMove: (direction: UnitVector) => void;
  triggerShoot: () => void;
  playerShoot: (player: Player) => void;
  newPlayer: (player: Player) => void;
  playerUpdate: (player: Player) => void;
  playerDied: (player: Player) => void;
  playerKill: (player: Player) => void;
  playerLeft: (player: Player) => void;
  playerSwitchedGun: (player: Player) => void;
  playerUnlockedGun: (player: Player) => void;
  playerReceivedDamage: (player: Player) => void;
}