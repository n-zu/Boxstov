import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { Enemy } from "./enemy";
import { BulletState } from "../../../common/types/state.js";
import { GunName, Guns } from "../../../common/guns.js";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  playerId = "none";
  gunName = GunName.Rifle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "");
  }

  public fire(
    x: number,
    y: number,
    rotation: number,
    playerId: string,
    gunName: GunName
  ) {
    const gun = Guns[gunName];
    const [velocityX, velocityY] = this.getVelocityFromRotation(rotation);

    this.setScale(0.5);
    this.setAlpha(0.3);
    this.setBodySize(70, 70);

    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
    this.setActive(true);
    this.setVisible(true);

    this.gunName = gunName;
    this.body.enable = true;
    this.playerId = playerId;

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.setActive(false);
        this.setVisible(false);
      }
    });
  }

  public die() {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
  }

  // We should use an interface for this
  public collideWith(enemy: Enemy) {
    const gun = Guns[this.gunName];
    enemy.receiveDamage(gun.damage, this.playerId);
    this.die();
  }

  public getState(): BulletState {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      active: this.active,
      visible: this.visible,
      gunName: this.gunName
    };
  }

  public setGunName(gunName: GunName) {
    if (this.gunName !== gunName) {
      this.gunName = gunName;
      this.setTexture(Guns[gunName].bulletTexture);
    }
  }

  public sync(bulletState: BulletState) {
    this.setPosition(bulletState.x, bulletState.y);
    this.setRotation(bulletState.rotation);
    this.setActive(bulletState.active);
    this.setVisible(bulletState.visible);
    this.setGunName(bulletState.gunName);
  }

  private getVelocityFromRotation(rotation: number) {
    const gun = Guns[this.gunName];
    const velocityX = gun.bulletSpeed * Math.cos(rotation);
    const velocityY = gun.bulletSpeed * Math.sin(rotation);
    return [velocityX, velocityY];
  }
}
