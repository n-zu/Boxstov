import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { BulletGroup } from "../groups/bulletGroup";
import { Direction, UnitVector } from "../../../common/types/direction.js";
import DirectionVector from "../../../common/controls/direction.js";
import { PlayerState } from "../../../common/types/state.js";
import { PlayerUpdatePayload } from "../../../common/types/messages.js";
const SPEED = 200;

// @ts-ignore
export class Player extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  id: string;
  movementDirection: DirectionVector = new DirectionVector(0, 1);
  maxHealth = 100;
  health = 100;
  lastUpdate = Date.now();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    gameMaster: GameMaster,
    bulletGroup: BulletGroup
  ) {
    super(scene, x, y, "");
    scene.physics.add.existing(this);

    this.id = id;
    this.scene = scene;
    this.gameMaster = gameMaster;
    this.bulletGroup = bulletGroup;
  }

  public shoot() {
    const { x: xGun, y: yGun } = this.getGunPosition();

    this.bulletGroup.shootBullet(xGun, yGun, this.movementDirection);
  }

  public move(direction: UnitVector) {
    const [x, y] = direction;
    let vector = new DirectionVector(x, y);
    this.setVelocity(...vector.getSpeed(SPEED));
    if (x || y) this.movementDirection = vector;
  }

  public getState(): PlayerState {
    return {
      id: this.id,
      position: {
        x: this.x,
        y: this.y,
      },
      health: this.health,
    };
  }

  public stopMovement() {
    this.setVelocity(0, 0);
  }

  public handleMessage(message: PlayerUpdatePayload) {
    this.lastUpdate = Date.now();
    switch (message.type) {
      case "move":
        this.move(message.direction);
        break;
      case "stop":
        this.stopMovement();
        break;
      case "shoot":
        this.shoot();
        break;
    }
  }

  private getGunPosition(): { x: number; y: number } {
    // We should change this logic so that the bullet receives the position and angle
    // of shooting, so that the bullet travels parallel to the player's gun
    switch (this.movementDirection.getDirection()) {
      case Direction.Up:
        return {
          x: this.x + 15,
          y: this.y - 120,
        };
      case Direction.Down:
        return {
          x: this.x - 16,
          y: this.y,
        };
      case Direction.Left:
        return {
          x: this.x - 95,
          y: this.y - 75,
        };
      case Direction.Right:
        return {
          x: this.x + 95,
          y: this.y - 65,
        };
      case Direction.UpLeft:
        return {
          x: this.x - 75,
          y: this.y - 120,
        };
      case Direction.UpRight:
        return {
          x: this.x + 95,
          y: this.y - 120,
        };
      case Direction.DownLeft:
        return {
          x: this.x - 35,
          y: this.y - 40,
        };
      case Direction.DownRight:
        return {
          x: this.x + 45,
          y: this.y - 10,
        };
    }
  }

  public receiveDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = this.maxHealth;
    }
  }
}
