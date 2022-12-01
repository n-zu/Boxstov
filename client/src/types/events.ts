import { GunName } from "../../../common/guns";
import { Events } from "../../../common/observer/observer";
import { UnitVector } from "../../../common/types/direction";
import { Player } from "../objects/player";

export interface GameEvents extends Events {
    changeGun: (name: GunName) => void;
    playerMove: (direction: UnitVector) => void;
    playerShoot: () => void;
    newPlayer: (player: Player) => void;
    playerUpdate: (player: Player) => void;
    playerDied: (player: Player) => void;
    playerLeft: (player: Player) => void;
}