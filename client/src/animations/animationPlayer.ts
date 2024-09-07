import Observer from "../../../common/observer/observer";
import PlayerModel from "../../../common/playerModel";
import { GameEvents } from "../../../common/types/events";
import { Player } from "../objects/player";
import { playAnimation } from "../scenes/mainScene";
import { AnimationSuffix } from "../types/animation";

export default class AnimationPlayer {
    scene: Phaser.Scene;
    observer: Observer<GameEvents>;

    constructor(scene: Phaser.Scene, observer: Observer<GameEvents>) {
        this.scene = scene;
        this.observer = observer;

        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.observer.subscribe("playerMoved", (player: PlayerModel) => this.playMoveAnimation(player as Player));
        this.observer.subscribe("playerSwitchedGun", (player: PlayerModel) => this.playMoveAnimation(player as Player));
    }

    private playMoveAnimation(player: Player) {
        playAnimation(
            player,
            player.arsenal.currentGun.getGunName(),
            player.facing,
            player.idle ? AnimationSuffix.Idle : AnimationSuffix.Run
        );
    }
}