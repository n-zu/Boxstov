import { BaseMessage, GuestMaster } from "../gameMaster/guestMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "../groups/bulletGroup";
import { AnimationActor, AnimationSuffix, playAnimation } from "../scenes/mainScene";
import Sprite = Phaser.Physics.Arcade.Sprite;

const SPEED = 200;
const diagonalFactor = Math.sqrt(2) / 2;
const SYNC_DIFF_TOLERANCE = 0.01;
const SYNC_DEPTH_TOLERANCE = 0.01;

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
  velocity: {
    x: number;
    y: number;
  };
  health: number;
};

export class Player extends Sprite {
  scene: Phaser.Scene;
  gameMaster: GuestMaster;
  bulletGroup: BulletGroup;
  id: string;
  facing: Direction = Direction.Down;
  maxHealth = 100;
  health = 100;
  movementDirection: Direction | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    gameMaster: GuestMaster,
    bulletGroup: BulletGroup
  ) {
    super(scene, x, y, "player");
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.gameMaster = gameMaster;
    this.bulletGroup = bulletGroup;

    this.setBodySize(180, 220);
    this.setDisplaySize(250, 250);
    this.setDisplayOrigin(250, 320);
    this.setOffset(160, 240);

    playAnimation(this, AnimationActor.Player, Direction.Down, AnimationSuffix.Idle);
  }

  public getId() {
    return this.id;
  }

  public shoot(emitAlert = true) {
    {
      const aud = new Audio("/assets/shoot.mp3");
      aud.volume = 0.1;
      aud.play();
    }

    const { x: xGun, y: yGun } = this.getGunPosition();

    if (emitAlert) {
      this.gameMaster.send("player", {
        id: this.id,
        payload: {
          type: "shoot"
        }
      });
    }
    this.bulletGroup.shootBullet(xGun, yGun, this.facing);
  }

  public doMove(direction: Direction) {
    const [x, y] = getUnitVector(direction);
    this.setVelocity(x * SPEED, y * SPEED);
  }

  public move(
    direction: Direction
  ) {
    this.facing = direction;
    if (this.movementDirection !== direction) {
      this.sendMovementMessage(direction);
    }
    this.movementDirection = direction;
    playAnimation(this, AnimationActor.Player, direction, AnimationSuffix.Run);
    this.doMove(direction);
  }

  public sync(state: PlayerState) {
    this.syncPosition(state.position.x, state.position.y);
    this.syncDepth(state.position.y);
    this.health = state.health;
  }

  public stopMovement() {
    if (this.movementDirection) {
      this.gameMaster.send("player", {
        id: this.id,
        payload: {
          type: "stop"
        }
      });
    }
    this.movementDirection = null;
    this.doStopMovement();
  }

  public handleMessage(message: BaseMessage) {
    switch (message.type) {
      case "move":
        this.doMove(message.direction);
        break;
      case "stop":
        this.doStopMovement();
        break;
      case "shoot":
        this.shoot(false);
        break;
    }
  }

  private doStopMovement() {
    this.setVelocity(0, 0);
    this.playIdleAnimation(this.facing);
  }

  private syncDepth(y: number) {
    if (Math.abs(this.y - y) > SYNC_DEPTH_TOLERANCE) {
      this.setDepth(y);
    }
  }

  private syncPosition(x: number, y: number) {
    const diffX = Math.abs(this.x - x);
    const diffY = Math.abs(this.y - y);
    if (diffX > SYNC_DIFF_TOLERANCE || diffY > SYNC_DIFF_TOLERANCE) {
      this.setPosition(x, y);
    }
  }

  private playIdleAnimation(direction: Direction) {
    const animationName = `${AnimationActor.Player}-${direction}-${AnimationSuffix.Idle}`;
    this.anims.play(animationName, true);
  }

  private sendMovementMessage(direction: Direction) {
    this.gameMaster.send("player", {
      id: this.id,
      payload: {
        type: "move",
        direction
      }
    });
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
