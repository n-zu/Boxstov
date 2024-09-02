import { GunName } from "../../../common/guns.js";
import { Bullet } from "../objects/bullet.js";
import Gun from "./gun.js";

export default class Shotgun extends Gun {
    public shoot(x: number, y: number, shooterId: string, rotation: number): void {
        for (let i = 0; i < 5; i++) {
            const bullet = this.bullets.getFirstDead(false) as Bullet;
            if (bullet) {
              bullet.fire(
                x,
                y,
                rotation + (i - 2) * 0.1,
                shooterId,
                this.getGunName()
              );
            }
        }
    }

    public getGunName(): GunName {
        return GunName.Shotgun;
    }
}