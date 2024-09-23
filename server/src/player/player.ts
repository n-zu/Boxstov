import "@geckos.io/phaser-on-nodejs";
import PlayerModel from "../../../common/playerModel.js";
import PlayerArsenal from "./playerArsenal.js";
import { DirectionEnum as DirectionEnumProto } from "../../../common/generated/utils/direction.js";
import { PlayerUpdate as PlayerUpdateProto } from "../../../common/generated/messages/playerUpdate.js";
import { Player as PlayerProto } from "../../../common/generated/player/player.js";

import { gunTypeToGunName } from "../../../common/utils.js";

export class Player extends PlayerModel {
    lastUpdate = Date.now();

    public getState(): PlayerProto {
        return {
            id: this.id,
            position: {
                x: this.x,
                y: this.y
            },
            facing: this.facing,
            idle: this.idle,
            health: this.health,
            arsenal: (this.arsenal as PlayerArsenal).getState(),
        };
    }

    public handleMessage(message: PlayerUpdateProto) {
        this.lastUpdate = Date.now();
        if (message.movement) {
            this.move(message.movement.direction?.direction);
        } else if (message.shoot) {
            this.shoot();
        } else if (message.switchGun) {
            this.switchGun(gunTypeToGunName(message.switchGun.gunType));
        } else if (message.stop) {
            this.move();
        } else if (message.ping === undefined) {
            console.error("function: handleMessage | action: unknown message type | message: ", message);
        }
    }
}
