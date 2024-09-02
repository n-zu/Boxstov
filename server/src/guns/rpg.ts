import { GunName } from "../../../common/guns.js";
import { Bullet } from "../objects/bullet.js";
import Gun from "./gun.js";

export default class Rpg extends Gun {
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
        return GunName.Rpg;
    }

    public getBulledSpeed(): number {
        // FIXME: Read from config file
        return 1000;   
    }

    public getDamage(): number {
        // FIXME: Read from config file
        return 200;   
    }
}