import "@geckos.io/phaser-on-nodejs";
import { BulletModel } from "../../../common/bulletModel.js";
import { BulletState } from "../../../common/types/state.js";
import { gunNameToGunType } from "../../../common/utils.js";

export class Bullet extends BulletModel {
  public getState(): BulletState {
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
