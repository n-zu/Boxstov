import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { Direction } from "../../../common/types/direction.js";
import MovementDirection from "../../../common/controls/direction.js";
import { PlayerRecentEvent, PlayerState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SPEED } from "../../../common/constants.js";
import { GunName, Guns } from "../../../common/guns.js";
import Observer from "../../../common/observer/observer.js";


export class Player extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  observer: Observer;
  id: string;
  movementDirection: MovementDirection = new MovementDirection();
  maxHealth = 100;
  health = 100;
  lastUpdate = Date.now();
  gunName = GunName.Rifle;
  recentEvents: PlayerRecentEvent[] = [];

  constructor(
    scene: Phaser.Scene,
    observer: Observer,
    id: string,
    gameMaster: GameMaster,
    x: number = 0,
    y: number = 0
  ) {
    super(scene, x, y, "");
    scene.physics.add.existing(this);

    this.observer = observer;
    this.id = id;
    this.scene = scene;
    this.gameMaster = gameMaster;
  }

  public shoot(playerId: string, gunName: GunName = this.gunName) {
    const gun = Guns[gunName];
    const rotation = gun.getGunRotation(this.movementDirection);
    const [xGun, yGun] = gun.getGunOffset(this.movementDirection);

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
    // TODO: check if the gun is available
    this.gunName = gunName;
  }

  public move(direction: MovementDirection) {
    this.movementDirection = direction;
    this.setVelocity(...this.movementDirection.getSpeed(PLAYER_SPEED));
  }

  public getState(): PlayerState {
    this.clampPosition();

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
        this.shoot(message.id);
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

  private clampPosition() {
    const w = GAME_WIDTH / 2 - 50;
    const h = GAME_HEIGHT / 2 - 50;
    if (this.x > w) this.x = w;
    if (this.x < -w) this.x = -w;
    if (this.y > h) this.y = h;
    if (this.y < -h) this.y = -h;
  }

  private getGunPosition(): { x: number; y: number } {
    // We should change this logic so that the bullet receives the position and angle
    // of shooting, so that the bullet travels parallel to the player's gun
    switch (this.movementDirection.getFacingDirection()) {
      case Direction.Up:
        return {
          x: this.x + 15,
          y: this.y - 120
        };
      case Direction.Down:
        return {
          x: this.x - 16,
          y: this.y
        };
      case Direction.Left:
        return {
          x: this.x - 95,
          y: this.y - 75
        };
      case Direction.Right:
        return {
          x: this.x + 95,
          y: this.y - 65
        };
      case Direction.UpLeft:
        return {
          x: this.x - 75,
          y: this.y - 120
        };
      case Direction.UpRight:
        return {
          x: this.x + 95,
          y: this.y - 120
        };
      case Direction.DownLeft:
        return {
          x: this.x - 35,
          y: this.y - 40
        };
      case Direction.DownRight:
        return {
          x: this.x + 45,
          y: this.y - 10
        };
    }
  }
}
