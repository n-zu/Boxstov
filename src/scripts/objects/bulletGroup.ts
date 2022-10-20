import { Bullet } from "./bullet";

export type BulletGroupState = {};

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  public shootBullet(x: number, y: number, rotation: number) {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(x, y, rotation);
    }
  }

  public getState(): BulletGroupState {
    return {};
  }
}
