import { GameMaster } from "../gameMaster/gameMaster.js";
import * as Phaser from "phaser";
import pkg from "phaser";
import { BulletGroup } from "../groups/bulletGroup.js";
import { BaseMessage } from "../gameMaster/hostMaster.js";

const { Physics } = pkg;

const SPEED = 200;
const diagonalFactor = Math.sqrt(2) / 2;


export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  UpLeft = "upLeft",
  UpRight = "upRight",
  DownLeft = "downLeft",
  DownRight = "downRight",
}

export type PlayerMessage = {
  id: string;
  payload: PlayerState;
}

export function getUnitVector(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.Up:
      return [0, -1];
    case Direction.Down:
      return [0, 1];
    case Direction.Left:
      return [-1, 0];
    case Direction.Right:
      return [1, 0];
    case Direction.UpLeft:
      return [-diagonalFactor, -diagonalFactor];
    case Direction.UpRight:
      return [diagonalFactor, -diagonalFactor];
    case Direction.DownLeft:
      return [-diagonalFactor, diagonalFactor];
    case Direction.DownRight:
      return [diagonalFactor, diagonalFactor];
  }
}

export type PlayerState = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  health: number;
};

export class Player extends Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  id: string;
  facing: Direction = Direction.Down;
  maxHealth = 100;
  health = 100;

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

    this.setBodySize(180, 220);
    this.setDisplaySize(250, 250);
    this.setDisplayOrigin(250, 320);
    this.setOffset(160, 240);

    this.id = id;
    this.scene = scene;
    this.gameMaster = gameMaster;
    this.bulletGroup = bulletGroup;
  }

  public shoot() {
    const { x: xGun, y: yGun } = this.getGunPosition();

    this.bulletGroup.shootBullet(xGun, yGun, this.facing);
  }

  public move(
    direction: Direction
  ) {
    const [x, y] = getUnitVector(direction);
    this.setVelocity(x * SPEED, y * SPEED);
    this.setDepth(this.y);
    this.facing = direction;
  }

  public getState(): PlayerState {
    this.setDepth(this.y);
    return {
      id: this.id,
      position: {
        x: this.x,
        y: this.y
      },
      health: this.health
    };
  }

  public stopMovement() {
    this.setVelocity(0, 0);
  }

  public handleMessage(message: BaseMessage) {
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
    switch (this.facing) {
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
