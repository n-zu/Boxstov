import config from "./config.js";
import { GunName } from "./guns/gun";
import Observer from "./observer/observer";
import PlayerArsenalModel from "./playerArsenalModel.js";
import { Direction, directionToRadians } from "./types/direction.js";
import { GameEvents } from "./types/events";
import { polarToCartesian } from "./utils.js";

export default class PlayerModel extends Phaser.Physics.Arcade.Sprite {
    id: string;
    scene: Phaser.Scene;
    observer: Observer<GameEvents>;
    facing: Direction = Direction.Down;
    idle: boolean = true;

    maxHealth: number;
    health: number;
    arsenal: PlayerArsenalModel;

    constructor(id: string,
        scene: Phaser.Scene,
        observer: Observer<GameEvents>,
        position: { x: number, y: number },
        arsenal: PlayerArsenalModel,
        sprite: string = "") {
        super(scene, position.x, position.y, sprite)
        this.id = id;
        this.scene = scene;
        this.addToScene();

        this.observer = observer;
        this.arsenal = arsenal;
        this.maxHealth = config.player.health;
        this.health = this.maxHealth;

        this.observer.notify("newPlayer", this);
        this.subscribeToEvents();
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

    public move(direction?: Direction) {
        if (!direction) {
            this.stopMovement();
        } else {
            this.facing = direction;
            this.idle = false;
            this.setVelocity(...polarToCartesian(directionToRadians(direction), config.player.speed));
        }
        this.observer.notify("playerMoved", this);
    }

    public receiveDamage(damage: number) {
        this.observer.notify("playerReceivedDamage", this);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.observer.notify("playerDied", this);
        }
    }

    private subscribeToEvents() {
        this.observer.subscribe("playerKill", (killer: PlayerModel) => {
            console.log(`Player ${this.id} killed a zombie`);
            if (this.id === killer.id) {
                this.arsenal.addKill(this);
            }
        });
    }

    public stopMovement() {
        this.idle = true;
        this.setVelocity(0, 0);
    }
}