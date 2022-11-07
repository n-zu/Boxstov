import Sprite = Phaser.GameObjects.Sprite;
import { getUnitVector } from "./player";
import { Direction } from "../../../common/types/direction";
import { BulletState } from "../../../common/types/state";

export class Bullet extends Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet");
  }

  public fire(x: number, y: number, direction: Direction) {
    const speed = 2000;
    const [velocityX, velocityY] = this.getVelocity(direction, speed);
    const rotation = Math.atan2(velocityY, velocityX);

    this.setScale(0.5);
    this.setAlpha(0.3);

    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setActive(true);
    this.setVisible(true);

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
  }

  private getVelocity(direction: Direction, speed: number) {
    const [x, y] = getUnitVector(direction);
    return [x * speed, y * speed];
  }
}
