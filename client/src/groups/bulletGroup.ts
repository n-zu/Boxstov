import BulletGroupInterface from "../../../common/bulletGroupInterface";
import Gun from "../../../common/guns/gun";
import Observer from "../../../common/observer/observer";
import PlayerModel from "../../../common/playerModel";
import { BulletGroupState } from "../../../common/types/state";
import { Bullet } from "../objects/bullet";
import { GameEvents } from "../types/events";

export class BulletGroup extends Phaser.GameObjects.Group implements BulletGroupInterface {
  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    super(scene);

    function factory() {
      return new Bullet(scene, observer);
    }

    this.createMultiple({
      frameQuantity: 30,
      key: "bullet",
      active: false,
      visible: false,
      classType: factory,
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
      bullet.fire(x, y, rotation, shooter, origin);
    }
  }
}
