import { BulletGroupModel } from "./bulletGroupModel";
import MovementDirection from "./controls/direction";
import { GUN_OFFSETS, GUN_ROTATIONS } from "./guns/constants.js";
import Gun, { GunName } from "./guns/gun.js";
import Rifle from "./guns/rifle.js";
import Rpg from "./guns/rpg.js";
import Shotgun from "./guns/shotgun.js";
import Observer from "./observer/observer.js";
import PlayerModel from "./playerModel.js";
import { GameEvents } from "./types/events.js";

export default class PlayerArsenalModel {
    playerId: string;
    kills: number;
    currentGun: Gun;
    guns: Gun[];
    bullets: BulletGroupModel;
    observer: Observer<GameEvents>;

    lastTimeShoot: number = 0;

    constructor(playerId: string, bullets: BulletGroupModel, observer: Observer<GameEvents>, availableGuns?: Gun[]) {
        this.playerId = playerId;
        this.kills = 0;
        this.bullets = bullets;
        this.guns = availableGuns || [new Rifle(bullets), new Shotgun(bullets), new Rpg(bullets)];
        this.currentGun = this.guns[0];
        this.observer = observer;
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.observer.subscribe("playerKill", (killer: PlayerModel) => {
            if (this.playerId === killer.id) {
                this.kills++;
                for (let gun of this.guns) {
                    if (gun.getKillsToUnlock() == this.kills) {
                        this.observer.notify("playerUnlockedGun", killer);
                    }
                }
            }
        });
    }

    public shoot(player: PlayerModel): boolean {
        if (this.isReloading()) {
            return false;
        }

        const rotation = GUN_ROTATIONS[player.movementDirection.getFacingDirection()] as number;
        const [xGun, yGun] = this.getGunOffset(player.movementDirection);

        this.currentGun.shoot(player.x + xGun, player.y + yGun, player, rotation);

        this.observer.notify("playerShoot", player);
        this.updateLastTimeShoot();
        return true;
    }

    public switchGun(player: PlayerModel, gunName: GunName, force: boolean = false) {
        for (const gun of this.guns) {
            if (gun.getGunName() === gunName) {
                if (gun.getKillsToUnlock() <= this.kills || force) {
                    this.currentGun = gun;
                    this.observer.notify("playerSwitchedGun", player);
                }
                break;
            }
        }
    }

    private getGunOffset(movementDirection: MovementDirection): [number, number] {
        if (!movementDirection.isMoving()) {
            return GUN_OFFSETS.idle[movementDirection.getFacingDirection()] as [number, number];
        } else {
            return GUN_OFFSETS.moving[movementDirection.getFacingDirection()] as [number, number];
        }
    }

    private isReloading() {
        return this.lastTimeShoot + this.currentGun.getReloadTime() > Date.now();
    }

    private updateLastTimeShoot() {
        this.lastTimeShoot = Date.now();
    }
}