import { Bullet } from "../objects/bullet.js";
import { BulletGroupState } from "../../../common/types/state.js";
import { GunName } from "../../../common/guns.js";

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet
    });
  }

  public shootBullet(
    x: number,
    y: number,
    rotation: number,
    playerId: string,
    gunName: GunName
  ) {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(x, y, rotation, playerId, gunName);
    }
  }

  public getState(): BulletGroupState {
    return this.children.entries.map((bullet) => {
      const b = bullet as Bullet;
      return b.getState();
    });
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
