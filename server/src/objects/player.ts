import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { BulletGroup } from "../groups/bulletGroup";
import { Direction, UnitVector } from "../../../common/types/direction.js";
import MovementDirection from "../../../common/controls/direction.js";
import { PlayerState } from "../../../common/types/state.js";
import { PlayerUpdate } from "../../../common/types/messages.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../../../common/constants.js";
import { GunName } from "../../../common/guns.js";
const SPEED = 200;

// @ts-ignore
export class Player extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  id: string;
  movementDirection: MovementDirection = new MovementDirection();
  maxHealth = 100;
  health = 100;
  lastUpdate = Date.now();
  gunName = GunName.Rifle;

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

  public shoot(playerId: string, gunName: GunName = this.gunName) {
    const { x: xGun, y: yGun } = this.getGunPosition();

    this.bulletGroup.shootBullet(
      xGun,
      yGun,
      this.movementDirection,
      playerId,
      gunName
    );
  }

  public switchGun(gunName: GunName) {
    // TODO: check if the gun is available
    this.gunName = gunName;
  }

  public move(direction: MovementDirection) {
    this.movementDirection = direction;
    this.setVelocity(...this.movementDirection.getSpeed(SPEED));
  }

  private clampPosition() {
    const w = GAME_WIDTH / 2 - 50;
    const h = GAME_HEIGHT / 2 - 50;
    if (this.x > w) this.x = w;
    if (this.x < -w) this.x = -w;
    if (this.y > h) this.y = h;
    if (this.y < -h) this.y = -h;
  }

  public getState(): PlayerState {
    this.clampPosition();

    return {
      id: this.id,
      position: {
        x: this.x,
        y: this.y,
      },
      movementDirection: this.movementDirection.encode(),
      health: this.health,
      gunName: this.gunName,
    };
  }

  public stopMovement() {
    this.setVelocity(0, 0);
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

  private getGunPosition(): { x: number; y: number } {
    // We should change this logic so that the bullet receives the position and angle
    // of shooting, so that the bullet travels parallel to the player's gun
    switch (this.movementDirection.getFacingDirection()) {
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
    if (this.health <= 0) this.health = 0;
  }
}
