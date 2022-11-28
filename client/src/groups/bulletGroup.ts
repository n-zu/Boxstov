import MovementDirection from "../../../common/controls/direction";
import { GunName } from "../../../common/guns";
import { BulletGroupState } from "../../../common/types/state";
import { Bullet } from "../objects/bullet";

export class BulletGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene);

    this.createMultiple({
      frameQuantity: 30,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  public shootBullet(
    x: number,
    y: number,
    direction: MovementDirection,
    gunName: GunName
  ) {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(x, y, direction, gunName);
    }
  }

  public sync(bulletGroupState: BulletGroupState) {
    bulletGroupState.forEach((bulletState, i) => {
      const bullet = this.children.entries[i] as Bullet;
      bullet.sync(bulletState);
    });
  }
}
