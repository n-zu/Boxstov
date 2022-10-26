import { GameMaster } from "../gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "./bulletGroup";
import { AnimationActor, AnimationSuffix } from "../scenes/mainScene";
import Sprite = Phaser.Physics.Arcade.Sprite;

const SPEED = 200;
const diagonalFactor = Math.sqrt(2) / 2;

export enum Direction {
  Up,
  Down,
  Left,
  Right,
  UpLeft,
  UpRight,
  DownLeft,
  DownRight,
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

export type MovementMessage = {
  type: "move";
  playerId: string;
  direction: Direction;
};

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
  rotation: number;
  animation?: {
    key: string;
    frame: number;
  };
};

export class Player extends Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  id: string;
  facing: Direction = Direction.Down;

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

    this.playIdleAnimation(Direction.Down);
  }

  public getId() {
    return this.id;
  }

  public shoot(emitAlert = true) {
    console.log(this.facing);

    {
      const aud = new Audio("/assets/shoot.mp3");
      aud.volume = 0.1;
      aud.play();
    }

    const { x: xGun, y: yGun } = this.getGunPosition();

    if (emitAlert) {
      this.gameMaster.send("shoot", {
        id: this.id
      });
    }
    this.bulletGroup.shootBullet(xGun, yGun, this.facing);
  }

  public move(
    direction: Direction, emitAlert = true
  ) {
    const [x, y] = getUnitVector(direction);
    this.setVelocity(x * SPEED, y * SPEED);
    this.facing = direction;
    this.playMovementAnimation(direction);
    if (emitAlert) {
      this.sendMovementMessage(direction);
    }
  }

  public sync(state: PlayerState) {
    this.setPosition(state.position.x, state.position.y);
    this.setDepth(state.position.y);
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
    if (state.animation) {
      // There is a bug here, probably
      // If I set ignoreIfPlaying to false, and then move the guest player, when it
      // receives a sync message, I get the following error:
      // Uncaught TypeError: Cannot read properties of undefined (reading 'duration')
      // It seems that ignoreIfPlaying to true makes the bug less reproducible
      try {
        if (this.anims.currentFrame) {
          this.anims.play(
            {
              key: state.animation.key,
              startFrame: state.animation.frame
            },
            true
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  public getState(): PlayerState {
    let currentAnimation: { key: string; frame: number } | undefined;
    if (this.anims.currentAnim && this.anims.currentFrame) {
      currentAnimation = {
        key: this.anims.currentAnim.key,
        frame: this.anims.currentFrame.index
      };
    }
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
      rotation: this.rotation,
      animation: currentAnimation
    };
  }

  public stopMovement(emitAlert = true) {
    if (this.isMoving() && emitAlert) {
      this.gameMaster.send("stop", { id: this.id });
    }
    this.playIdleAnimation(this.facing);
    this.setVelocity(0, 0);
  }

  private isMoving(): boolean {
    return this.body.velocity.x !== 0 || this.body.velocity.y !== 0;
  }

  private playIdleAnimation(direction: Direction) {
    const animationName = `${AnimationActor.Player}-${direction}-${AnimationSuffix.Idle}`;
    this.anims.play(animationName, true);
  }

  private sendMovementMessage(direction: Direction) {
    this.gameMaster.send("move", {
      id: this.id,
      direction
    });
  }

  private playMovementAnimation(direction: Direction) {
    const animationName = `${AnimationActor.Player}-${direction}-${AnimationSuffix.Run}`;
    this.anims.play(animationName, true);
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
