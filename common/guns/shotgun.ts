import BulletGroupInterface from "../bulletGroupInterface.js";
import config from "../config.js";
import Gun from "./gun.js";

export default class Shotgun extends Gun {
    constructor(bullets: BulletGroupInterface) {
        super(
            bullets,
            "shotgun",
            config.guns.shotgun.bulletSpeed,
            config.guns.shotgun.damage,
            config.guns.shotgun.reloadTime,
            config.guns.shotgun.killsToUnlock);
    }

    public shoot(x: number, y: number, shooterId: string, rotation: number): void {
        for (let i = 0; i < 5; i++) {
            const bullet = this.bullets.shoot(x, y, rotation + (i - 2) * 0.1, shooterId, this);
        }
    }
}