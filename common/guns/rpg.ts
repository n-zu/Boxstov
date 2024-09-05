import BulletGroupInterface from "../bulletGroupInterface.js";
import config from "../config.js";
import PlayerModel from "../playerModel.js";
import Gun from "./gun.js";

export default class Rpg extends Gun {
    constructor(bullets: BulletGroupInterface) {
        super(
            bullets,
            "rpg",
            config.guns.rpg.bulletSpeed,
            config.guns.rpg.damage,
            config.guns.rpg.reloadTime,
            config.guns.rpg.killsToUnlock);
    }

    public shoot(x: number, y: number, shooter: PlayerModel, rotation: number): void {
        const bullet = this.bullets.shoot(x, y, rotation, shooter, this);
    }
}