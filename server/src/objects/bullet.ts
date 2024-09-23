import "@geckos.io/phaser-on-nodejs";
import { BulletModel } from "../../../common/bulletModel.js";
import { gunNameToGunType } from "../../../common/utils.js";
import { Bullet as BulletProto } from "../../../common/generated/bullet.js";

export class Bullet extends BulletModel {
  public getState(): BulletProto {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      rotation: this.rotation,
      active: this.active,
      visible: this.visible,
      origin: gunNameToGunType(this.origin?.getGunName() || "rifle"),
    };
  }
}
