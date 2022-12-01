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

  private fireRifleBullet(bulletInfo: BulletInfo) {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(
        bulletInfo.x,
        bulletInfo.y,
        bulletInfo.rotation,
        bulletInfo.playerId,
        bulletInfo.gunName
      );
    }
  }

  private fireShotgunBullet(bulletInfo: BulletInfo) {
    for (let i = 0; i < 5; i++) {
      const bullet = this.getFirstDead(false) as Bullet;
      if (bullet) {
        const rotation = bulletInfo.rotation + (i - 2) * 0.1;
        console.log(rotation);
        bullet.fire(
          bulletInfo.x,
          bulletInfo.y,
          rotation,
          bulletInfo.playerId,
          bulletInfo.gunName
        );
      }
    }
  }

  private fireRpgBullet(bulletInfo: BulletInfo) {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(
        bulletInfo.x,
        bulletInfo.y,
        bulletInfo.rotation,
        bulletInfo.playerId,
        bulletInfo.gunName
      );
    }
  }

  private subscribeToEvents() {
    this.observer.subscribe("shootBullet", (bulletInfo) => {
      switch (bulletInfo.gunName) {
        case GunName.Rifle:
          this.fireRifleBullet(bulletInfo);
          break;
        case GunName.Shotgun:
          this.fireShotgunBullet(bulletInfo);
          break;
        case GunName.Rpg:
          this.fireRpgBullet(bulletInfo);
      }
    });
  }
}
