import "@geckos.io/phaser-on-nodejs";
import { BulletState } from "../../../common/types/state.js";
import { BulletModel } from "../../../common/bulletModel.js";

export class Bullet extends BulletModel {
  public getState(): BulletState {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      active: this.active,
      visible: this.visible,
      gunName: this.origin?.getGunName() || "rifle",
    };
  }
}
