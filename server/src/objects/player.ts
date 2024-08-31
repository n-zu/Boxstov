import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import MovementDirection from "../../../common/controls/direction.js";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import { KILLS_TO_UNLOCK, PLAYER_SIZE, PLAYER_SPEED } from "../../../common/constants.js";
import { GunName, Guns } from "../../../common/guns.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events.js";


export class Player extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  observer: Observer<GameEvents>;
  id: string;
  movementDirection: MovementDirection = new MovementDirection();
  maxHealth = 100;
  health = 100;
  kills = 0;
  lastUpdate = Date.now();
  gunName = GunName.Rifle;
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
    this.subscribeToEvents();
  }

  public shoot(gunName: GunName = this.gunName) {
    const gun = Guns[gunName];
    const rotation = gun.getGunRotation(this.movementDirection);
    const [xGun, yGun] = gun.getGunOffset(this.movementDirection);

    const playerId = this.id;
    this.observer.notify("shootBullet", {
      x: this.x + xGun,
      y: this.y + yGun,
      rotation,
      gunName,
      playerId
    });
    this.recentEvents.push("shoot");
  }

  public switchGun(gunName: GunName) {
    if (this.kills >= KILLS_TO_UNLOCK[gunName]) {
      this.gunName = gunName;
    }
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
      gunName: this.gunName,
      events: this.recentEvents
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

  private subscribeToEvents() {
    this.observer.subscribe("enemyKilled", (killerId: string) => {
      if (this.id === killerId) {
        this.kills++;
        this.recentEvents.push("kill");
        for (const gunName of Object.keys(Guns)) {
          if (this.kills === KILLS_TO_UNLOCK[gunName as GunName]) {
            this.recentEvents.push("unlocked_gun");
          }
        }
      }
    });
  }

  private clearEvents() {
    this.recentEvents = [];
  }
}
