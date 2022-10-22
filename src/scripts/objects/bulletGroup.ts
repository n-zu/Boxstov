import { Bullet } from "./bullet";

type BulletState = {
  x: number;
  y: number;
  rotation: number;
  active: boolean;
  visible: boolean;
};
export type BulletGroupState = BulletState[];

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
    const bulletInfo: BulletGroupState = this.children.entries.map((bullet) => {
      const b = bullet as Bullet;
      const bState: BulletState = {
        x: b.x,
        y: b.y,
        rotation: b.rotation,
        active: b.active,
        visible: b.visible,
      };
      return bState;
    });
    return bulletInfo;
  }

  public sync(bulletGroupState: BulletGroupState) {
    bulletGroupState.forEach((bulletState, i) => {
      const bullet = this.children.entries[i] as Bullet;
      bullet.setPosition(bulletState.x, bulletState.y);
      bullet.setRotation(bulletState.rotation);
      bullet.setActive(bulletState.active);
      bullet.setVisible(bulletState.visible);
    });
  }
}
