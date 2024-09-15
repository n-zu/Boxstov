import { BulletGroupModel } from "./bulletGroupModel";
import { GUN_OFFSETS, GUN_ROTATIONS } from "./guns/constants.js";
import Gun, { GunName } from "./guns/gun.js";
import Rifle from "./guns/rifle.js";
import Rpg from "./guns/rpg.js";
import Shotgun from "./guns/shotgun.js";
import Observer from "./observer/observer.js";
import PlayerModel from "./playerModel.js";
import { Direction } from "./types/direction";
import { GameEvents } from "./types/events.js";

export default class PlayerArsenalModel {
    kills: number;
    currentGun: Gun;
    guns: Gun[];
    bullets: BulletGroupModel;
    observer: Observer<GameEvents>;

    lastTimeShoot: number = 0;

    constructor(bullets: BulletGroupModel, observer: Observer<GameEvents>, availableGuns?: Gun[]) {
        this.kills = 0;
        this.bullets = bullets;
        this.guns = availableGuns || [new Rifle(bullets), new Shotgun(bullets), new Rpg(bullets)];
        this.currentGun = this.guns[0];
        this.observer = observer;
    }

    public addKill(player: PlayerModel) {
        this.kills++;
        for (let gun of this.guns) {
            if (gun.getKillsToUnlock() == this.kills) {
                this.observer.notify("playerUnlockedGun", player);
            }
        }
    }

    public shoot(player: PlayerModel): boolean {
        if (this.isReloading()) {
            return false;
        }

        const rotation = GUN_ROTATIONS[player.facing] as number;
        const [xGun, yGun] = this.getGunOffset(player.facing, player.idle);

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

    private getGunOffset(direction: Direction, idle: boolean): [number, number] {
        if (idle) {
            return GUN_OFFSETS.idle[direction] as [number, number];
        } else {
            return GUN_OFFSETS.moving[direction] as [number, number];
        }
    }

    private isReloading() {
        return this.lastTimeShoot + this.currentGun.getReloadTime() > Date.now();
    }

    private updateLastTimeShoot() {
        this.lastTimeShoot = Date.now();
    }
}