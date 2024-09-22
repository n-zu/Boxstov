import * as Phaser from "phaser";
import { BulletGroupModel } from "../../../common/bulletGroupModel";
import { GunName } from "../../../common/guns/gun";
import Observer from "../../../common/observer/observer.js";
import PlayerModel from "../../../common/playerModel";
import { GameEvents } from "../../../common/types/events";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state";
import { GameMaster } from "../gameMaster/gameMaster";
import PlayerArsenal from "./playerArsenal";
import { Direction as DirectionProto, DirectionEnum as DirectionEnumProto } from "../../../common/generated/utils/direction.js";
import { PlayerArsenal as PlayerArsenalProto } from "../../../common/generated/player/playerArsenal.js";
import { Player as PlayerProto } from "../../../common/generated/player/player.js";
import { EncodedDirection } from "../../../common/types/messages";
import { Buffer } from "buffer";

const SYNC_DIFF_TOLERANCE = 0.001;

export class Player extends PlayerModel {
    gameMaster: GameMaster;

    local: boolean;

    constructor(
        id: string,
        scene: Phaser.Scene,
        observer: Observer<GameEvents>,
        position: { x: number; y: number },
        gameMaster: GameMaster,
        bullets: BulletGroupModel,
        local = false,
    ) {
        super(id, scene, observer, position, new PlayerArsenal(bullets, observer));

        this.gameMaster = gameMaster;
        this.local = local;
    }

    public sendMovementMessageIfNecessary(direction?: DirectionEnumProto) {
        if (this.idle) {
            if (direction !== undefined) {
                this.sendMovementMessage(direction);
            }
        } else {
            if (direction === undefined) {
                this.sendMovementMessage();
            } else if (this.facing !== direction) {
                this.sendMovementMessage(direction);
            }
        }
    }

    public shoot(): boolean {
        if (super.shoot()) {
            this.gameMaster.send("player", {
                id: this.id,
                type: "shoot",
                gunName: this.arsenal.currentGun.getGunName()
            });
            return true;
        }
        return false;
    }

    public switchGun(gunName: GunName): void {
        super.switchGun(gunName);
        if (this.local) {
            this.gameMaster.send("player", {
                id: this.id,
                type: "switch_gun",
                gunName
            });
        }
    }

    public sync(playerProto: PlayerProto, recentEvents: PlayerRecentEvent[]) {
        if (playerProto.position) {
            this.syncPosition(playerProto.position.x, playerProto.position.y);
        }
        
        this.syncEvents(recentEvents);

        this.health = playerProto.health;
        if (this.health <= 0) {
            this.observer.notify("playerDied", this);
        }

        if (this.local) {
            this.notifyInconsistencies(playerProto);
        } else {
            if (playerProto.idle) {
                this.move();
            } else {
                this.move(playerProto.facing);
            }
        }
        if (playerProto.arsenal) {
            (this.arsenal as PlayerArsenal).sync(this, playerProto.arsenal);
        }
    }

    public getDistanceToCamera(): number {
        const camera = this.scene.cameras.main;
        const cameraX = camera.scrollX + camera.width / 2;
        const cameraY = camera.scrollY + camera.height / 2;

        return Phaser.Math.Distance.Between(cameraX, cameraY, this.x, this.y);
    }

    public getMaxDistanceToCamera(): number {
        const camera = this.scene.cameras.main;
        return Math.sqrt(Math.pow(camera.width, 2) + Math.pow(camera.height, 2));
    }

    private notifyInconsistencies(state: PlayerProto) {
        if (state.facing !== undefined && this.facing !== state.facing) {
            if (state.idle) {
                this.sendMovementMessage();
            } else {
                this.sendMovementMessage(this.facing);
            }
        } else if (this.idle !== state.idle) {
            if (this.idle) {
                this.sendMovementMessage();
            } else {
                this.sendMovementMessage(this.facing);
            }
        }
    }

    private syncEvents(events: PlayerRecentEvent[]) {
        if (this.local) {
            return;
        }
        events.forEach(event => {
            switch (event) {
                case "shoot":
                    this.observer.notify("playerShoot", this);
                    break;
                case "receive_damage":
                    this.observer.notify("playerReceivedDamage", this);
                    break;
            }
        });
    }

    private syncPosition(x: number, y: number) {
        const diffX = Math.abs(this.x - x);
        const diffY = Math.abs(this.y - y);
        if (diffX > SYNC_DIFF_TOLERANCE || diffY > SYNC_DIFF_TOLERANCE) {
            this.setPosition(x, y);
            this.setDepth(y);
        }
    }

    private sendMovementMessage(direction?: DirectionEnumProto) {
        if (direction === undefined) {
            this.gameMaster.send("player", {
                id: this.id,
                type: "move"
            });
        } else {
            this.gameMaster.send("player", {
                id: this.id,
                type: "move",
                direction: { direction: direction }
            });
        }
    }
}
