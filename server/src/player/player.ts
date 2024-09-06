import "@geckos.io/phaser-on-nodejs";
import MovementDirection from "../../../common/controls/direction.js";
import { PlayerState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import { GunName } from "../../../common/guns/gun.js";
import PlayerModel from "../../../common/playerModel.js";
import PlayerArsenal from "./playerArsenal.js";

export class Player extends PlayerModel {
    lastUpdate = Date.now();

    public getState(): PlayerState {
        const state = {
            id: this.id,
            position: {
                x: this.x,
                y: this.y
            },
            movementDirection: this.movementDirection.encode(),
            health: this.health,
            playerArsenal: (this.arsenal as PlayerArsenal).getState(),
        };
        return state;
    }

    public handleMessage(message: PlayerUpdate) {
        this.lastUpdate = Date.now();
        switch (message.type) {
            case "move":
                this.move(MovementDirection.decode(message.direction));
                break;
            case "shoot":
                this.shoot();
                break;
            case "switch_gun":
                this.switchGun(message.gunName as GunName);
                break;
        }
    }
}
