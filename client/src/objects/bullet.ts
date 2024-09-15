import { BulletState } from "../../../common/types/state";
import Gun, { GunName } from "../../../common/guns/gun";
import { BulletModel } from "../../../common/bulletModel";
import PlayerModel from "../../../common/playerModel";

export class Bullet extends BulletModel {
  public fire(x: number, y: number, rotation: number, shooter: PlayerModel, origin: Gun): void {
    super.fire(x, y, rotation, shooter, origin);
    this.setBase();
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
  }

  setBase() {
    this.setScale(0.5);
    this.setAlpha(0.3);
  }

  public die() {
    this.setActive(false);
    this.setVisible(false);
  }

  private setGunName(gunName: GunName) {
    if (!this.origin || this.origin.getGunName() !== gunName) {
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
