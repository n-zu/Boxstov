import PlayerArsenalModel from "../../../common/playerArsenalModel.js";
import { PlayerArsenalState } from "../../../common/types/state";
import { PlayerArsenal as PlayerArsenalProto, GunType } from "../../../common/generated/player/playerArsenal.js";
import { Buffer } from "buffer";

export default class PlayerArsenal extends PlayerArsenalModel {
    public getState(): PlayerArsenalState {
        const bytes = PlayerArsenalProto.encode({
            currentGun: this.getCurrentGunType(),
            kills: this.kills,
        }).finish();
        return Buffer.from(bytes).toString("base64");
    }
}