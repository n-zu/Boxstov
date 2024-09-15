import { BulletGroupModel } from "../bulletGroupModel.js";
import config from "../config.js";
import PlayerModel from "../playerModel.js";
import Gun from "./gun.js";

export default class Shotgun extends Gun {
    constructor(bullets: BulletGroupModel) {
        super(
            bullets,
            "shotgun",
            config.guns.shotgun.bulletSpeed,
            config.guns.shotgun.damage,
            config.guns.shotgun.reloadTime,
            config.guns.shotgun.killsToUnlock);
    }

    public shoot(x: number, y: number, shooter: PlayerModel, rotation: number): void {
        for (let i = 0; i < 5; i++) {
            this.bullets.shoot(x, y, rotation + (i - 2) * 0.1, shooter, this);
        }
    }
}