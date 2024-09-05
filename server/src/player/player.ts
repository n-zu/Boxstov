import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import MovementDirection from "../../../common/controls/direction.js";
import { PlayerState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events.js";
import PlayerArsenal from "./playerArsenal.js";
import { BulletGroup } from "../groups/bulletGroup.js";
import config from "../../../common/config.js";
import { GunName } from "../../../common/guns/gun.js";


export class Player extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  observer: Observer<GameEvents>;
  id: string;
  movementDirection: MovementDirection = new MovementDirection();
  maxHealth: number;
  health: number;
  lastUpdate = Date.now();
  arsenal: PlayerArsenal;

  constructor(
    scene: Phaser.Scene,
    observer: Observer<GameEvents>,
    id: string,
    x = 0,
    y = 0,
    bullets: BulletGroup
  ) {
    super(scene, x, y, "");
    this.scene = scene;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBodySize(config.player.size.width, config.player.size.height);
    this.setCollideWorldBounds(true);

    this.observer = observer;
    this.id = id;
    this.arsenal = new PlayerArsenal(id, bullets, observer);
    this.maxHealth = config.player.health;
    this.health = this.maxHealth;
  }

  public shoot() {
    this.arsenal.shoot(this.x, this.y, this.movementDirection);
  }

  public switchGun(gunName: GunName) {
    this.arsenal.switchGun(gunName);
  }

  public move(direction: MovementDirection) {
    this.movementDirection = direction;
    this.setVelocity(...this.movementDirection.getSpeed(config.player.speed));
  }

  public getState(): PlayerState {
    const state = {
      id: this.id,
      position: {
        x: this.x,
        y: this.y
      },
      movementDirection: this.movementDirection.encode(),
      health: this.health,
      gunName: this.arsenal.currentGun.getGunName(),
    };
    return state;
  }

  public handleMessage(message: PlayerUpdate) {
    this.lastUpdate = Date.now();
    switch (message.type) {
      case "move":
        this.move(MovementDirection.decode(message.direction));
        break;
      case "shoot":
        this.shoot();
        break;
      case "switch_gun":
        this.switchGun(message.gunName as GunName);
        break;
    }
  }

  public receiveDamage(damage: number) {
    this.observer.notify("playerReceivedDamage", this.id);
    this.health -= damage;
    if (this.health <= 0) this.health = 0;
  }
}
