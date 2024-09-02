import { GunName } from "../../../common/guns.js";
import config from "../../../common/config.js";
import { Bullet } from "../objects/bullet.js";
import Gun from "./gun.js";

export default class Rifle extends Gun {
    public shoot(x: number, y: number, shooterId: string, rotation: number): void {
        const bullet = this.bullets.getFirstDead(false) as Bullet;
        if (bullet) {
            bullet.fire(
                x,
                y,
                rotation,
                shooterId,
                this
                );
        }
    }

    public getGunName(): GunName {
        return GunName.Rifle;
    }

    public getBulledSpeed(): number {
        return config.guns.rifle.bulletSpeed;
    }

    public getDamage(): number {
        return config.guns.rifle.damage;
    }

    public getKillsToUnlock(): number {
        return config.guns.rifle.killsToUnlock;
    }
}