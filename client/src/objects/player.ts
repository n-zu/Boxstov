import { GameMaster } from "../gameMaster/gameMaster";
import * as Phaser from "phaser";
import { Direction, UnitVector } from "../../../common/types/direction";
import MovementDirection from "../../../common/controls/direction";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state";
import { playAnimation } from "../scenes/mainScene";
import { AnimationSuffix } from "../types/animation";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";
import { GunName } from "../../../common/guns/gun";
import PlayerModel from "../../../common/playerModel";
import BulletGroupInterface from "../../../common/bulletGroupInterface";

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
        bullets: BulletGroupInterface,
        local = false,
    ) {
        super(id, scene, observer, position, bullets);

        this.gameMaster = gameMaster;
        this.local = local;

        // TODO: Move this to the view, tie it to the 'newPlayer' event
        playAnimation(this, this.arsenal.currentGun.getGunName(), Direction.Down, AnimationSuffix.Idle);
        this.subscribeToEvents();
    }

    public update() {
        this.observer.notify("playerUpdate", this);
    }

    moveTo(direction: UnitVector) {
        const previous = this.movementDirection.getUnitVector();
        this.movementDirection.update(direction);
        if (this.local && previous !== this.movementDirection.getUnitVector())
            this.sendMovementMessage(this.movementDirection);

        this.move(this.movementDirection);

        if (!this.movementDirection.isMoving()) {
            this.doStopMovement();
            return;
        }

        playAnimation(
            this,
            this.arsenal.currentGun.getGunName(),
            this.movementDirection.getFacingDirection(),
            AnimationSuffix.Run
        );
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
            this.movementDirection = MovementDirection.decode(
                state.movementDirection
            );
            this.move(this.movementDirection);
        }
        if (this.arsenal.currentGun.getGunName() !== state.gunName) {
            this.arsenal.switchGun(state.gunName, true);
            this.observer.notify("playerSwitchedGun", this);
            playAnimation(this, this.arsenal.currentGun.getGunName(), this.movementDirection.getFacingDirection(), AnimationSuffix.Idle);
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

    private subscribeToEvents() {
        if (this.local) {
            this.observer.subscribe("triggerChangeGun", (gunName: GunName) => {
                this.switchGun(gunName);
            });
            this.observer.subscribe("triggerMove", (direction) => {
                this.moveTo(direction);
            });
            this.observer.subscribe("triggerShoot", () => {
                this.shoot();
            });
        }
    }

    private notifyInconsistencies(state: PlayerState) {
        if (this.movementDirection.encode() !== state.movementDirection) {
            this.sendMovementMessage(this.movementDirection);
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
                case "kill":
                    this.observer.notify("playerKill", this);
                    break;
                case "unlocked_gun":
                    this.observer.notify("playerUnlockedGun", this);
                    break;
            }
        });
    }

    private doStopMovement() {
        this.setVelocity(0, 0);
        // TODO: Move this to the view, tie it to the 'playerStoppedMoving' event
        this.playIdleAnimation();
    }

    private syncPosition(x: number, y: number) {
        const diffX = Math.abs(this.x - x);
        const diffY = Math.abs(this.y - y);
        if (diffX > SYNC_DIFF_TOLERANCE || diffY > SYNC_DIFF_TOLERANCE) {
            this.setPosition(x, y);
            this.setDepth(y);
        }
    }

    private playIdleAnimation() {
        const animationName = `${this.arsenal.currentGun.getGunName()
            }-${this.movementDirection?.getFacingDirection()}-${AnimationSuffix.Idle}`;
        this.anims.play(animationName, true);
    }

    private sendMovementMessage(direction: MovementDirection) {
        this.gameMaster.send("player", {
            id: this.id,
            type: "move",
            direction: direction.encode()
        });
    }
}
