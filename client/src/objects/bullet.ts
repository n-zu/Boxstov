import Sprite = Phaser.GameObjects.Sprite;
import { BulletState } from "../../../common/types/state";
import Gun, { GunName } from "../../../common/guns/gun";
import { polarToCartesian } from "../../../common/utils";

export class Bullet extends Sprite {
  origin: GunName;

  constructor(scene: Phaser.Scene, x: number, y: number, origin?: Gun) {
    super(scene, x, y, "bullet");
    this.origin = "rifle";
  }

  public fire(
    x: number,
    y: number,
    rotation: number,
    origin: Gun
  ) {
    const velocity = polarToCartesian(rotation, origin.getBulledSpeed());
    
    this.setBase();
    this.setPosition(x, y);
    this.setRotation(rotation);
    this.setActive(true);
    this.setVisible(true);
    // FIXME: This is not very good
    switch (origin.getGunName()) {
      case "rifle":
        this.setTexture("bullet");
        break;
      case "shotgun":
        this.setTexture("shell");
        break;
      case "rpg":
        this.setTexture("rocket");
        break;
    }

    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.die();
      }
    });
  }

  setBase() {
    this.setScale(0.5);
    this.setAlpha(0.3);
  }

  public die() {
    this.setActive(false);
    this.setVisible(false);
  }

  public setGunName(gunName: GunName) {
    if (this.origin !== gunName) {
      this.origin = gunName;
      // FIXME
      switch (gunName) {
        case "rifle":
          this.setTexture("bullet");
          break;
        case "shotgun":
          this.setTexture("shell");
          break;
        case "rpg":
          this.setTexture("rocket");
          break;
      }
    }
  }

  public sync(bulletState: BulletState) {
    this.setBase();
    this.setDepth(bulletState.y);
    this.setPosition(bulletState.x, bulletState.y);
    this.setRotation(bulletState.rotation);
    this.setActive(bulletState.active);
    this.setVisible(bulletState.visible);
    this.setGunName(bulletState.gunName);
  }
}
