import BulletGroupInterface from "../../../common/bulletGroupInterface";
import Gun from "../../../common/guns/gun";
import PlayerModel from "../../../common/playerModel";
import { BulletGroupState } from "../../../common/types/state";
import { Bullet } from "../objects/bullet";

export class BulletGroup extends Phaser.GameObjects.Group implements BulletGroupInterface {
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

  public sync(bulletGroupState: BulletGroupState) {
    bulletGroupState.forEach((bulletState, i) => {
      const bullet = this.children.entries[i] as Bullet;
      bullet.sync(bulletState);
    });
  }
  
  public shoot(x: number, y: number, rotation: number, shooter: PlayerModel, origin: Gun): void {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(x, y, rotation, origin);
    }
  }
}
