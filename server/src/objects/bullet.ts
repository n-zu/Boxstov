import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { Enemy } from "./enemy";
import { BulletState } from "../../../common/types/state.js";
import MovementDirection from "../../../common/controls/direction.js";

const SPEED = 2000;

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  damage = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "");
  }

  public fire(x: number, y: number, direction: MovementDirection) {
    const [velocityX, velocityY] = direction.getSpeed(SPEED);
    const rotation = Math.atan2(velocityY, velocityX);

    this.setScale(0.5);
    this.setAlpha(0.3);
    this.setBodySize(70, 70);

    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.setActive(false);
        this.setVisible(false);
      },
    });
  }

  public die() {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
  }

  // We should use an interface for this
  public collideWith(enemy: Enemy) {
    enemy.receiveDamage(this.damage);
    this.die();
  }

  public getState(): BulletState {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      active: this.active,
      visible: this.visible,
    };
  }

  public sync(bulletState: BulletState) {
    this.setPosition(bulletState.x, bulletState.y);
    this.setRotation(bulletState.rotation);
    this.setActive(bulletState.active);
    this.setVisible(bulletState.visible);
  }
}
