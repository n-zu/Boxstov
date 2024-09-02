import { GunName } from "../../../common/guns";
import { BulletGroup } from "../groups/bulletGroup";

export default abstract class Gun {
    bullets: BulletGroup;
    constructor(bullets: BulletGroup) {
        this.bullets = bullets;
    }

    public abstract shoot(x: number, y: number, shooterId: string, rotation: number): void;

    public abstract getGunName(): GunName;

    public abstract getBulledSpeed(): number;

    public abstract getDamage(): number;
}