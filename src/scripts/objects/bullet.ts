import Sprite = Phaser.Physics.Arcade.Sprite;
import { Direction } from "./player";

const DIAGONAL_FACTOR = Math.sqrt(2) / 2;

export class Bullet extends Sprite {
  public fire(x: number, y: number, direction: Direction) {
    const speed = 2500;
    const [velocityX, velocityY] = this.getVelocity(direction, speed);
    const rotation = Math.atan2(velocityY, velocityX);

    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
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

  private getVelocity(direction: Direction, speed: number) {
    switch (direction) {
      case "up":
        return [0, -speed];
      case "down":
        return [0, speed];
      case "left":
        return [-speed, 0];
      case "right":
        return [speed, 0];
      case "up-left":
        return [-speed * DIAGONAL_FACTOR, -speed * DIAGONAL_FACTOR];
      case "up-right":
        return [speed * DIAGONAL_FACTOR, -speed * DIAGONAL_FACTOR];
      case "down-left":
        return [-speed * DIAGONAL_FACTOR, speed * DIAGONAL_FACTOR];
      case "down-right":
        return [speed * DIAGONAL_FACTOR, speed * DIAGONAL_FACTOR];
    }
  }
}
