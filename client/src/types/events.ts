import { GunName } from "../../../common/guns";
import { UnitVector } from "../../../common/types/direction";
import { Player } from "../objects/player";

export type GameEvents = {
    changeGun: (name: GunName) => void;
    playerMove: (direction: UnitVector) => void;
    playerShoot: () => void;
    newPlayer: (player: Player) => void;
    playerUpdate: (player: Player) => void;
    playerDied: (player: Player) => void;
    playerLeft: (player: Player) => void;
}