import config from "../config.js";
import { Bullet } from "../../server/src/objects/bullet.js";
import Gun from "./gun.js";
import BulletGroupInterface from "../bulletGroupInterface.js";
import PlayerModel from "../playerModel.js";

export default class Rifle extends Gun {
    constructor(bullets: BulletGroupInterface) {
        super(
            bullets,
            "rifle",
            config.guns.rifle.bulletSpeed,
            config.guns.rifle.damage,
            config.guns.rifle.reloadTime,
            config.guns.rifle.killsToUnlock);
    }

    public shoot(x: number, y: number, shooter: PlayerModel, rotation: number): void {
        const bullet = this.bullets.shoot(x, y, rotation, shooter, this);
    }
}