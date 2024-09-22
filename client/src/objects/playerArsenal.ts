import { BulletGroupModel } from "../../../common/bulletGroupModel";
import Observer from "../../../common/observer/observer";
import PlayerArsenalModel from "../../../common/playerArsenalModel";
import PlayerModel from "../../../common/playerModel";
import { GameEvents } from "../../../common/types/events";
import { PlayerArsenal as PlayerArsenalProto, GunType } from "../../../common/generated/player/playerArsenal";

export default class PlayerArsenal extends PlayerArsenalModel {
    constructor(bullets: BulletGroupModel, observer: Observer<GameEvents>) {
        super(bullets, observer);
    }

    public sync(player: PlayerModel, state: PlayerArsenalProto) {
        if (this.getCurrentGunType() !== state.currentGun) {
            this.observer.notify("playerSwitchedGun", player);
            switch (state.currentGun) {
                case GunType.Rifle:
                    this.currentGun = this.guns[0];
                    break;
                case GunType.Shotgun:
                    this.currentGun = this.guns[1];
                    break;
                case GunType.Rpg:
                    this.currentGun = this.guns[2];
                    break;
            }
        }
        this.kills = state.kills;
    }
}