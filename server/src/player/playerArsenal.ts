import PlayerArsenalModel from "../../../common/playerArsenalModel.js";
import { PlayerArsenalState } from "../../../common/types/state";

export default class PlayerArsenal extends PlayerArsenalModel {
    public getState(): PlayerArsenalState {
        return {
            currentGun: this.currentGun.getGunName(),
            kills: this.kills,
            lastTimeShoot: this.lastTimeShoot,
        };
    }
}