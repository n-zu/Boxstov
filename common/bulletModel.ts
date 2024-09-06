import { EnemyModel } from "./enemy/enemyModel";
import Gun from "./guns/gun";
import Observer from "./observer/observer";
import PlayerModel from "./playerModel";
import { GameEvents } from "./types/events";
import { polarToCartesian } from "./utils.js";

export class BulletModel extends Phaser.Physics.Arcade.Sprite {
    playerId = "";
    origin?: Gun;
    shooter?: PlayerModel;
    observer: Observer<GameEvents>;

    constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, sprite: string = "") {
        super(scene, 0, 0, sprite);
        this.setActive(false);
        this.setVisible(false);
        this.setPosition(0, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.observer = observer;
    }

    public fire(
        x: number,
        y: number,
        rotation: number,
        shooter: PlayerModel,
        origin: Gun
    ) {
        const velocity = polarToCartesian(rotation, origin.getBulledSpeed());

        this.setScale(0.5);
        this.setAlpha(0.3);
        this.setBodySize(70, 70);

        this.setPosition(x, y);
        this.setRotation(rotation);
        this.setVelocityX(velocity[0]);
        this.setVelocityY(velocity[1]);
        this.setActive(true);
        this.setVisible(true);

        this.origin = origin;
        this.body.enable = true;
        this.shooter = shooter;

        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.setActive(false);
                this.setVisible(false);
            }
        });
    }

    public die() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }

    public collideWith(enemy: EnemyModel) {
        if (this.origin && this.shooter) {
            enemy.receiveDamage(this.origin.getDamage(), this.shooter);
            this.die();
        }
    }
}
