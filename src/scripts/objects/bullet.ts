import Sprite = Phaser.Physics.Arcade.Sprite;

export class Bullet extends Sprite {
  public fire(x: number, y: number, rotation: number) {
    console.log(x, y, rotation);
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setVelocityX(Math.cos(rotation) * 200);
    this.setVelocityY(Math.sin(rotation) * 200);
  }
}
