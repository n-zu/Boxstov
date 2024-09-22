import Gun, { GunName } from "../../../common/guns/gun";
import { BulletModel } from "../../../common/bulletModel";
import PlayerModel from "../../../common/playerModel";
import { Bullet as BulletProto } from "../../../common/generated/bullet";
import { gunTypeToGunName } from "../../../common/utils";

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

  public sync(bulletState: BulletProto) {
    
    this.setBase();
    if (bulletState.position) {
      this.setDepth(bulletState.position.y);
      this.setPosition(bulletState.position.x, bulletState.position.y);
    }
    
    this.setRotation(bulletState.rotation);
    this.setActive(bulletState.active);
    this.setVisible(bulletState.visible);
    this.setGunName(gunTypeToGunName(bulletState.origin));
  }
}
