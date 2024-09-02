import { Bullet } from "../objects/bullet.js";
import { BulletGroupState } from "../../../common/types/state.js";
import Observer from "../../../common/observer/observer.js";
import { BulletInfo, GameEvents } from "../types/events.js";
import { GunName } from "../../../common/guns.js";

const MAX_BULLETS = 30;

export class BulletGroup extends Phaser.Physics.Arcade.Group {
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
}
