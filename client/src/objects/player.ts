import * as Phaser from "phaser";
import { BulletGroupModel } from "../../../common/bulletGroupModel";
import { GunName } from "../../../common/guns/gun";
import Observer from "../../../common/observer/observer.js";
import PlayerModel from "../../../common/playerModel";
import { Direction } from "../../../common/types/direction";
import { GameEvents } from "../../../common/types/events";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state";
import { GameMaster } from "../gameMaster/gameMaster";
import PlayerArsenal from "./playerArsenal";

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

    public sendMovementMessageIfNecessary(direction?: Direction) {
        if (this.idle) {
            if (direction) {
                this.sendMovementMessage(direction);
            }
        } else {
            if (!direction) {
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

    public sync(state: PlayerState, recentEvents: PlayerRecentEvent[]) {
        console.log("Syncing player");        
        this.syncPosition(state.position.x, state.position.y);
        this.syncEvents(recentEvents);

        this.health = state.health;
        if (this.health <= 0) {
            this.observer.notify("playerDied", this);
        }

        if (this.local) {
            this.notifyInconsistencies(state);
        } else {
            if (state.idle) {
                this.move();
            } else {
                this.move(state.facing as Direction);
            }
        }
        (this.arsenal as PlayerArsenal).sync(this, state.playerArsenal);
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

    private notifyInconsistencies(state: PlayerState) {
        if (this.facing !== state.facing) {
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

    private sendMovementMessage(direction?: Direction) {
        this.gameMaster.send("player", {
            id: this.id,
            type: "move",
            direction: direction
        });
    }
}
