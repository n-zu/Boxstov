import BulletGroupInterface from "../bulletGroupInterface";
import PlayerModel from "../playerModel";

export type GunName = "rifle" | "rpg" | "shotgun";

export default abstract class Gun {
    bullets: BulletGroupInterface;
    name: GunName;
    bulletSpeed: number;
    damage: number;
    reloadTime: number;
    killsToUnlock: number;

    constructor(
        bullets: BulletGroupInterface,
        name: GunName,
        bulletSpeed: number,
        damage: number,
        reloadTime: number,
        killsToUnlock: number) {

        this.bullets = bullets;
        this.name = name;
        this.bulletSpeed = bulletSpeed;
        this.damage = damage;
        this.reloadTime = reloadTime
        this.killsToUnlock = killsToUnlock;
    }

    public abstract shoot(x: number, y: number, shooter: PlayerModel, rotation: number): void;

    public getGunName(): GunName {
        return this.name;
    }

    public getBulledSpeed(): number {
        return this.bulletSpeed;
    }

    public getDamage(): number {
        return this.damage;
    }

    public getReloadTime(): number {
        return this.reloadTime;
    }

    public getKillsToUnlock(): number {
        return this.killsToUnlock;
    }
}