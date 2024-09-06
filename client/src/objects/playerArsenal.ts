import { BulletGroupModel } from "../../../common/bulletGroupModel";
import Observer from "../../../common/observer/observer";
import PlayerArsenalModel from "../../../common/playerArsenalModel";
import PlayerModel from "../../../common/playerModel";
import { PlayerArsenalState } from "../../../common/types/state";
import { playAnimation } from "../scenes/mainScene";
import { AnimationSuffix } from "../types/animation";
import { GameEvents } from "../types/events";

export default class PlayerArsenal extends PlayerArsenalModel {
    constructor(bullets: BulletGroupModel, observer: Observer<GameEvents>) {
        super(bullets, observer);
    }

    public sync(player: PlayerModel, state: PlayerArsenalState) {
        if (this.currentGun.getGunName() !== state.currentGun) {
            playAnimation(player, this.currentGun.getGunName(), player.movementDirection.getFacingDirection(), AnimationSuffix.Idle);
            switch (state.currentGun) {
                case "rifle":
                    this.currentGun = this.guns[0];
                    break;
                case "shotgun":
                    this.currentGun = this.guns[1];
                    break;
                case "rpg":
                    this.currentGun = this.guns[2];
                    break;
            }
        }
        this.kills = state.kills;
    }
}