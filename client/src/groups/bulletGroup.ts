import { BulletGroupModel } from "../../../common/bulletGroupModel";
import Gun from "../../../common/guns/gun";
import Observer from "../../../common/observer/observer";
import PlayerModel from "../../../common/playerModel";
import { GameEvents } from "../../../common/types/events";
import { BulletGroupState } from "../../../common/types/state";
import { Bullet } from "../objects/bullet";

export class BulletGroup extends BulletGroupModel {
  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    super(scene, observer, (scene, observer) => new Bullet(scene, observer));
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
