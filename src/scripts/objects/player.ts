import { GameMaster } from "../gameMaster/gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "../groups/bulletGroup";
import { AnimationActor, AnimationSuffix, playAnimation } from "../scenes/mainScene";
import { BaseMessage } from "../gameMaster/hostMaster";
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
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.scene = scene;
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

  public move(
    direction: Direction, emitAlert = true
  ) {
    if (this.gameMaster.shouldSendSync()) {
      const [x, y] = getUnitVector(direction);
      this.setVelocity(x * SPEED, y * SPEED);
    }
    if (emitAlert) {
      this.sendMovementMessage(direction);
    }
    this.facing = direction;
    playAnimation(this, AnimationActor.Player, direction, AnimationSuffix.Run);
  }

  public sync(state: PlayerState) {
    this.syncPosition(state.position);
    // this.syncVelocity(state.velocity);
    this.syncDepth(state.position.y);
    this.health = state.health;
  }

  public getState(): PlayerState {
    this.setDepth(this.y);
    return {
      id: this.id,
      position: {
        x: this.x,
        y: this.y
      },
      velocity: {
        x: this.body.velocity.x,
        y: this.body.velocity.y
      },
      health: this.health
    };
  }

  public stopMovement(emitAlert = true) {
    if (emitAlert) {
      //if (this.isMoving() && emitAlert) {
      this.gameMaster.send("player", {
        id: this.id,
        payload: {
          type: "stop"
        }
      });
    }
    this.playIdleAnimation(this.facing);
    this.setVelocity(0, 0);
  }

  public handleMessage(message: BaseMessage) {
    switch (message.type) {
      case "move":
        this.move(message.direction, false);
        break;
      case "stop":
        this.stopMovement(false);
        break;
      case "shoot":
        this.shoot(false);
        break;
    }
  }

  private syncDepth(y: number) {
    if (Math.abs(this.y - y) > SYNC_DEPTH_TOLERANCE) {
      this.setDepth(y);
    }
  }

  private syncVelocity(velocity: { x: number; y: number }) {
    if (
      Math.abs(this.body.velocity.x - velocity.x) > SYNC_DIFF_TOLERANCE ||
      Math.abs(this.body.velocity.y - velocity.y) > SYNC_DIFF_TOLERANCE
    ) {
      this.setVelocity(velocity.x, velocity.y);
    } else {
      console.log("Not syncing velocity because it is too close");
    }
  }

  private syncPosition(position: { x: number; y: number }) {
    const diffX = Math.abs(this.x - position.x);
    const diffY = Math.abs(this.y - position.y);
    if (diffX > SYNC_DIFF_TOLERANCE || diffY > SYNC_DIFF_TOLERANCE) {
      this.setPosition(position.x, position.y);
    } else {
      console.log("Not syncing position because it is too close");
    }
  }

  private isMoving(): boolean {
    return this.body.velocity.x !== 0 || this.body.velocity.y !== 0;
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
