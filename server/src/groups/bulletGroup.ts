import { Bullet } from "../objects/bullet.js";
import { BulletGroupState } from "../../../common/types/state.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events.js";

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
    this.subscribeToEvents();
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

  private subscribeToEvents() {
    this.observer.subscribe("shootBullet", (args) => {
      const bullet = this.getFirstDead(false) as Bullet;
      if (bullet) {
        bullet.fire(args.x, args.y, args.rotation, args.playerId, args.gunName);
      }
    });
  }
}
