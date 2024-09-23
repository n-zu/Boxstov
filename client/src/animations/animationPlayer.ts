import config from "../../../common/config";
import { EnemyModel } from "../../../common/enemy/enemyModel";
import Observer from "../../../common/observer/observer";
import PlayerModel from "../../../common/playerModel";
import { roundAngleToDirection } from "../../../common/types/direction";
import { GameEvents } from "../../../common/types/events";
import { Player } from "../objects/player";
import { playAnimation } from "../scenes/mainScene";
import { AnimationActor, AnimationSuffix } from "../types/animation";

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
        this.observer.subscribe("enemyMoved", (enemy: EnemyModel) => this.playEnemyMoveAnimation(enemy as EnemyModel));
        this.observer.subscribe("enemyReceivedDamage", (enemy: EnemyModel) => this.playEnemyDamageAnimation(enemy as EnemyModel));
        this.observer.subscribe("enemyDied", (enemy: EnemyModel) => this.playEnemyDeathAnimation(enemy as EnemyModel));
    }

    private playMoveAnimation(player: Player) {
        playAnimation(
            player,
            player.arsenal.currentGun.getGunName(),
            player.facing,
            player.idle ? AnimationSuffix.Idle : AnimationSuffix.Run
        );
    }

    private playEnemyMoveAnimation(enemy: EnemyModel) {
        const action =
        enemy.brain.action === AnimationSuffix.Attack
          ? AnimationSuffix.Attack
          : enemy.physique.speed >= config.enemies.zombieNormal.speed
            ? AnimationSuffix.Run
            : AnimationSuffix.Walk;

        playAnimation(
            enemy,
            AnimationActor.Zombie,
            roundAngleToDirection(enemy.angle),
            action
        );
    }

    private playEnemyDeathAnimation(enemy: EnemyModel) {
        enemy.setTint(0xff5555);
        setTimeout(() => enemy.setTint(0xffdddd), 1000);
    
        playAnimation(
          enemy,
          AnimationActor.Zombie,
          roundAngleToDirection(enemy.angle),
          AnimationSuffix.Die
        );
    }

    private playEnemyDamageAnimation(enemy: EnemyModel) {
        enemy.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => enemy.setTint(0xff5555));
        this.scene.time.delayedCall(200, () => enemy.setTint(0xffaaaa));
        this.scene.time.delayedCall(300, () => enemy.setTint(0xffffff));
    }
}