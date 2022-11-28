import Sprite = Phaser.GameObjects.Sprite;
import { BulletState } from "../../../common/types/state";
import MovementDirection from "../../../common/controls/direction";
import { GunName, Guns } from "../../../common/guns";

export class Bullet extends Sprite {
  gunName = GunName.Rifle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet");
  }

  public fire(
    x: number,
    y: number,
    direction: MovementDirection,
    gunName: GunName
  ) {
    const gun = Guns[gunName];
    const [velocityX, velocityY] = direction.getFacingSpeed(gun.bulletSpeed);
    const rotation = Math.atan2(velocityY, velocityX);

    this.setScale(0.5);
    this.setAlpha(0.3);

    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setActive(true);
    this.setVisible(true);

    this.setTexture(Guns[gunName].bulletTexture);

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.setActive(false);
        this.setVisible(false);
      },
    });
  }

  public die() {
    this.setActive(false);
    this.setVisible(false);
  }

  public sync(bulletState: BulletState) {
    this.setPosition(bulletState.x, bulletState.y);
    this.setRotation(bulletState.rotation);
    this.setActive(bulletState.active);
    this.setVisible(bulletState.visible);

    if (this.gunName !== bulletState.gunName) {
      this.gunName = bulletState.gunName;
      this.setTexture(Guns[bulletState.gunName].bulletTexture);
    }
  }
}
