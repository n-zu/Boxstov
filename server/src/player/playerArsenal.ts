import PlayerArsenalModel from "../../../common/playerArsenalModel.js";
import { PlayerArsenal as PlayerArsenalProto } from "../../../common/generated/player/playerArsenal.js";

export default class PlayerArsenal extends PlayerArsenalModel {
    public getState(): PlayerArsenalProto {
        return {
            currentGun: this.getCurrentGunType(),
            kills: this.kills,
        };
    }
}