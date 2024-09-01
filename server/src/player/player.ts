import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import MovementDirection from "../../../common/controls/direction.js";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import { PLAYER_SIZE, PLAYER_SPEED } from "../../../common/constants.js";
import { GunName } from "../../../common/guns.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events.js";
import PlayerArsenal from "./playerArsenal.js";


export class Player extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  observer: Observer<GameEvents>;
  id: string;
  movementDirection: MovementDirection = new MovementDirection();
  maxHealth = 100;
  health = 100;
  lastUpdate = Date.now();
  arsenal: PlayerArsenal;
  recentEvents: PlayerRecentEvent[] = [];

  constructor(
    scene: Phaser.Scene,
    observer: Observer<GameEvents>,
    id: string,
    x = 0,
    y = 0
  ) {
    super(scene, x, y, "");
    this.scene = scene;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBodySize(...PLAYER_SIZE);
    this.setCollideWorldBounds(true);

    this.observer = observer;
    this.id = id;
    this.arsenal = new PlayerArsenal(id, observer);
  }

  public shoot() {
    this.arsenal.shoot(this.x, this.y, this.movementDirection);
    this.recentEvents.push("shoot");
  }

  public switchGun(gunName: GunName) {
    this.arsenal.switchGun(gunName);
  }

  public move(direction: MovementDirection) {
    this.movementDirection = direction;
    this.setVelocity(...this.movementDirection.getSpeed(PLAYER_SPEED));
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
      gunName: this.arsenal.currentGun,
      // FIXME: This is a hack to avoid refactoring the client right now
      events: this.recentEvents.concat(this.arsenal.recentEvents)
    };
    this.clearEvents();
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
    this.health -= damage;
    this.recentEvents.push("receive_damage");
    if (this.health <= 0) this.health = 0;
  }

  private clearEvents() {
    this.recentEvents = [];
  }
}
