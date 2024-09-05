import { Bullet } from "../objects/bullet.js";
import { BulletGroupState } from "../../../common/types/state.js";
import Observer from "../../../common/observer/observer.js";
import BulletGroupInterface from "../../../common/bulletGroupInterface.js";
import Gun from "../../../common/guns/gun.js";
import { GameEvents } from "../../../common/types/events.js";
import PlayerModel from "../../../common/playerModel.js";

const MAX_BULLETS = 30;

export class BulletGroup extends Phaser.Physics.Arcade.Group implements BulletGroupInterface {
  observer: Observer<GameEvents>;

  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
    super(scene.physics.world, scene);

    this.observer = observer;

    const bullets: Bullet[] = [];
    for (let i = 0; i < MAX_BULLETS; i++) {
      bullets.push(new Bullet(scene, observer));
    }
    this.addMultiple(bullets);
  }

  public getState(): BulletGroupState {
    return this.children.entries.map((bullet) => {
      const b = bullet as Bullet;
      return b.getState();
    });
  }

  public shoot(x: number, y: number, rotation: number, shooter: PlayerModel, origin: Gun): void {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(x, y, rotation, shooter, origin);
    }  
  }
}
