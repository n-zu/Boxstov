import Sprite = Phaser.Physics.Arcade.Sprite;

export class Bullet extends Sprite {
  public fire(x: number, y: number, rotation: number) {
    const speed = 500;

    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setVelocityX(Math.cos(rotation) * speed);
    this.setVelocityY(Math.sin(rotation) * speed);

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.setActive(false);
        this.setVisible(false);
      },
    });
  }
}
