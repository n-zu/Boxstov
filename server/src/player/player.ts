import "@geckos.io/phaser-on-nodejs";
import { GunName } from "../../../common/guns/gun.js";
import PlayerModel from "../../../common/playerModel.js";
import { EncodedDirection, PlayerUpdate } from "../../../common/types/messages.js";
import { PlayerState } from "../../../common/types/state.js";
import PlayerArsenal from "./playerArsenal.js";
import { Direction as DirectionProto, DirectionEnum as DirectionEnumProto } from "../../../common/generated/direction.js";
import { Direction } from "../../../common/types/direction.js";
import { Buffer } from "buffer";

export class Player extends PlayerModel {
    lastUpdate = Date.now();

    public getState(): PlayerState {
        const state = {
            id: this.id,
            position: {
                x: this.x,
                y: this.y
            },
            facing: this.facing,
            idle: this.idle,
            health: this.health,
            playerArsenal: (this.arsenal as PlayerArsenal).getState(),
        };
        return state;
    }

    public handleMessage(message: PlayerUpdate) {
        this.lastUpdate = Date.now();
        console.log(`Player ${this.id} received message: ${JSON.stringify(message)}`);
        switch (message.type) {
            case "move":
                this.move(this.decodeDirection(message.direction));
                break;
            case "shoot":
                this.shoot();
                break;
            case "switch_gun":
                this.switchGun(message.gunName as GunName);
                break;
        }
    }

    private decodeDirection(direction?: EncodedDirection): Direction | undefined {
        if (!direction) {
            return undefined;
        }
        const dirJson = DirectionProto.decode(Buffer.from(direction, "base64"));
        switch (dirJson.direction) {
            case DirectionEnumProto.Up:
                return Direction.Up;
            case DirectionEnumProto.Down:
                return Direction.Down;
            case DirectionEnumProto.Left:
                return Direction.Left;
            case DirectionEnumProto.Right:
                return Direction.Right;
            case DirectionEnumProto.UpLeft:
                return Direction.UpLeft;
            case DirectionEnumProto.UpRight:
                return Direction.UpRight;
            case DirectionEnumProto.DownLeft:
                return Direction.DownLeft;
            case DirectionEnumProto.DownRight:
                return Direction.DownRight;
            default:
                return undefined;
        }
    }
}
