import { GameMaster } from "../gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "./bulletGroup";
import Sprite = Phaser.Physics.Arcade.Sprite;

const SPEED = 200;
const diagonalFactor = Math.sqrt(2) / 2;

export type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right";

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
  facing: Direction = "down";

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

    this.anims.play("down-idle", true);
  }

  public getId() {
    return this.id;
  }

  public shoot(emitAlert = true) {
    console.log(this.facing);
    const { x: xGun, y: yGun } = this.getGunPosition();

    if (emitAlert) {
      this.gameMaster.send("shoot", {
        id: this.id,
      });
    }
    this.bulletGroup.shootBullet(xGun, yGun, this.facing);
  }

  public move(
    direction:
      | "up"
      | "down"
      | "left"
      | "right"
      | "up-left"
      | "up-right"
      | "down-left"
      | "down-right"
  ) {
    switch (direction) {
      case "up":
        this.moveUp(false);
        break;
      case "down":
        this.moveDown(false);
        break;
      case "left":
        this.moveLeft(false);
        break;
      case "right":
        this.moveRight(false);
        break;
      case "up-left":
        this.moveUpLeft(false);
        break;
      case "up-right":
        this.moveUpRight(false);
        break;
      case "down-left":
        this.moveDownLeft(false);
        break;
      case "down-right":
        this.moveDownRight(false);
        break;
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
              startFrame: state.animation.frame,
            },
            true
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  public moveUp(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "up",
      });
    }
    this.anims.play("up", true);
    this.facing = "up";
    this.setVelocity(0, -SPEED);
  }

  public moveDown(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "down",
      });
    }
    this.anims.play("down", true);
    this.facing = "down";
    this.setVelocity(0, SPEED);
  }

  public moveLeft(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "left",
      });
    }
    this.anims.play("left", true);
    this.facing = "left";
    this.setVelocity(-SPEED, 0);
  }

  public moveRight(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "right",
      });
    }
    this.anims.play("right", true);
    this.facing = "right";
    this.setVelocity(SPEED, 0);
  }

  public moveUpLeft(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "up-left",
      });
    }
    this.anims.play("up-left", true);
    this.facing = "up-left";
    this.setVelocity(-SPEED * diagonalFactor, -SPEED * diagonalFactor);
  }

  public moveUpRight(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "up-right",
      });
    }

    this.anims.play("up-right", true);
    this.facing = "up-right";
    this.setVelocity(SPEED * diagonalFactor, -SPEED * diagonalFactor);
  }

  public moveDownLeft(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "down-left",
      });
    }

    this.anims.play("down-left", true);
    this.facing = "down-left";
    this.setVelocity(-SPEED * diagonalFactor, SPEED * diagonalFactor);
  }

  public moveDownRight(emitAlert = true) {
    if (emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "down-right",
      });
    }

    this.anims.play("down-right", true);
    this.facing = "down-right";
    this.setVelocity(SPEED * diagonalFactor, SPEED * diagonalFactor);
  }

  public getState(): PlayerState {
    let currentAnimation: { key: string; frame: number } | undefined;
    if (this.anims.currentAnim && this.anims.currentFrame) {
      currentAnimation = {
        key: this.anims.currentAnim.key,
        frame: this.anims.currentFrame.index,
      };
    }
    this.setDepth(this.y);
    return {
      id: this.id,
      position: {
        x: this.x,
        y: this.y,
      },
      velocity: {
        x: this.body.velocity.x,
        y: this.body.velocity.y,
      },
      rotation: this.rotation,
      animation: currentAnimation,
    };
  }

  public stopMovement(emitAlert = true) {
    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      if (emitAlert) {
        this.gameMaster.send("stop", { id: this.id });
      }
    }
    if (this.body.velocity.x > 0) {
      this.anims.play("right-idle", true);
    } else if (this.body.velocity.x < 0) {
      this.anims.play("left-idle", true);
    } else if (this.body.velocity.y > 0) {
      this.anims.play("down-idle", true);
    } else if (this.body.velocity.y < 0) {
      this.anims.play("up-idle", true);
    }
    this.setVelocity(0, 0);
  }

  private getGunPosition(): { x: number; y: number } {
    // We should change this logic so that the bullet receives the position and angle
    // of shooting, so that the bullet travels parallel to the player's gun
    switch (this.facing) {
      case "up":
        return {
          x: this.x + 15,
          y: this.y + 20,
        };
      case "down":
        return {
          x: this.x - 16,
          y: this.y,
        };
      case "left":
        return {
          x: this.x - 85,
          y: this.y - 50,
        };
      case "right":
        return {
          x: this.x + 85,
          y: this.y - 35,
        };
      case "up-left":
        return {
          x: this.x - 45,
          y: this.y - 60,
        };

      case "up-right":
        return {
          x: this.x + 45,
          y: this.y - 40,
        };

      case "down-left":
        return {
          x: this.x - 35,
          y: this.y - 40,
        };

      case "down-right":
        return {
          x: this.x + 45,
          y: this.y - 10,
        };
      default:
        return {
          x: this.x + 85,
          y: this.y - 35,
        };
    }
  }
}
