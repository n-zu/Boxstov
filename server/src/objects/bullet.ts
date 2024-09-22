import "@geckos.io/phaser-on-nodejs";
import { BulletModel } from "../../../common/bulletModel.js";
import { BulletState } from "../../../common/types/state.js";
import { Bullet as BulletProto } from "../../../common/generated/bullet.js";
import { Buffer } from "buffer";
import { gunNameToGunType } from "../../../common/utils.js";

export class Bullet extends BulletModel {
  public getState(): BulletState {
    const state = {
      position: {
        x: this.x,
        y: this.y
      },
      rotation: this.rotation,
      active: this.active,
      visible: this.visible,
      origin: gunNameToGunType(this.origin?.getGunName() || "rifle"),
    };

    const bytes = BulletProto.encode(state).finish();
    return Buffer.from(bytes).toString("base64");
  }
}
