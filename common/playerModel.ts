import { BulletGroupModel } from "./bulletGroupModel.js";
import config from "./config.js";
import MovementDirection from "./controls/direction.js";
import { GunName } from "./guns/gun";
import Observer from "./observer/observer";
import PlayerArsenalModel from "./playerArsenalModel.js";
import { GameEvents } from "./types/events";

export default class PlayerModel extends Phaser.Physics.Arcade.Sprite {
    id: string;
    scene: Phaser.Scene;
    observer: Observer<GameEvents>;
    movementDirection: MovementDirection = new MovementDirection();
    maxHealth: number;
    health: number;
    arsenal: PlayerArsenalModel;

    constructor(id: string,
        scene: Phaser.Scene,
        observer: Observer<GameEvents>,
        position: { x: number, y: number },
        bullets: BulletGroupModel,
        sprite: string = "") {
        super(scene, position.x, position.y, sprite)
        this.id = id;
        this.scene = scene;
        this.addToScene();

        this.observer = observer;
        this.arsenal = new PlayerArsenalModel(id, bullets, observer);
        this.maxHealth = config.player.health;
        this.health = this.maxHealth;

        this.observer.notify("newPlayer", this);
    }

    private addToScene() {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setBodySize(config.player.size.width, config.player.size.height);
        this.setCollideWorldBounds(true);
    }

    public update() {
        this.observer.notify("playerUpdate", this);
    }

    public shoot(): boolean {
        return this.arsenal.shoot(this);
    }

    public switchGun(gunName: GunName) {
        this.arsenal.switchGun(this, gunName);
    }

    public move(direction: MovementDirection) {
        this.movementDirection = direction;
        this.setVelocity(...this.movementDirection.getSpeed(config.player.speed));
    }

    public receiveDamage(damage: number) {
        this.observer.notify("playerReceivedDamage", this);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.observer.notify("playerDied", this);
        }
    }
}