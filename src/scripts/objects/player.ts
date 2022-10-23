import { GameMaster } from "../gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "./bulletGroup";
import Sprite = Phaser.Physics.Arcade.Sprite;

const SPEED = 200;

export type MovementMessage = {
  type: "move";
  playerId: string;
  direction: "up" | "down" | "left" | "right";
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

    this.scale = 0.5;
  }

  public getId() {
    return this.id;
  }

  public shoot(x: number, y: number, emitAlert: boolean = true) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    if (emitAlert) {
      this.gameMaster.send("shoot", {
        id: this.id,
        x: x,
        y: y,
      });
    }
    this.bulletGroup.shootBullet(this.x, this.y, angle);
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
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
    if (state.animation) {
      // There is a bug here, probably
      // If I set ignoreIfPlaying to false, and then move the guest player, when it
      // receives a sync message, I get the following error:
      // Uncaught TypeError: Cannot read properties of undefined (reading 'duration')
      // It seems that ignoreIfPlaying to true makes the bug less reproducible
      this.anims.play(
        {
          key: state.animation.key,
          startFrame: state.animation.frame,
        },
        true
      );
    }
  }

  public moveUp(emitAlert: boolean = true) {
    if (this.body.velocity.y !== -SPEED && emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "up",
      });
    }
    this.anims.play("up", true);
    this.setVelocity(0, -SPEED);
  }

  public moveDown(emitAlert: boolean = true) {
    if (this.body.velocity.y !== SPEED && emitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "down",
      });
    }
    this.anims.play("down", true);
    this.setVelocity(0, SPEED);
  }

  public moveLeft(emmitAlert: boolean = true) {
    if (this.body.velocity.x !== -SPEED && emmitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "left",
      });
    }
    this.anims.play("left", true);
    this.setVelocity(-SPEED, 0);
  }

  public moveRight(emmitAlert: boolean = true) {
    if (this.body.velocity.x !== SPEED && emmitAlert) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "right",
      });
    }
    this.anims.play("right", true);
    this.setVelocity(SPEED, 0);
  }

  public moveUpLeft(emitAlert: boolean = true) {
    if (
      (this.body.velocity.y !== -SPEED || this.body.velocity.x !== -SPEED) &&
      emitAlert
    ) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "up-left",
      });
    }
    this.anims.play("up-left", true);
    // we probably want to use trigonometry here
    this.setVelocity(-SPEED, -SPEED);
  }

  public moveUpRight(emitAlert: boolean = true) {
    if (
      (this.body.velocity.y !== -SPEED || this.body.velocity.x !== SPEED) &&
      emitAlert
    ) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "up-right",
      });
    }

    this.anims.play("up-right", true);
    this.setVelocity(SPEED, -SPEED);
  }

  public moveDownLeft(emitAlert: boolean = true) {
    if (
      (this.body.velocity.y !== SPEED || this.body.velocity.x !== -SPEED) &&
      emitAlert
    ) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "down-left",
      });
    }

    this.anims.play("down-left", true);
    this.setVelocity(-SPEED, SPEED);
  }

  public moveDownRight(emitAlert: boolean = true) {
    if (
      (this.body.velocity.y !== SPEED || this.body.velocity.x !== SPEED) &&
      emitAlert
    ) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "down-right",
      });
    }

    this.anims.play("down-right", true);
    this.setVelocity(SPEED, SPEED);
  }

  public getState(): PlayerState {
    let currentAnimation: { key: string; frame: number } | undefined;
    if (this.anims.currentAnim && this.anims.currentFrame) {
      currentAnimation = {
        key: this.anims.currentAnim.key,
        frame: this.anims.currentFrame.index,
      };
    }
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

  public stopMovement(emitAlert: boolean = true) {
    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      if (emitAlert) {
        this.gameMaster.send("stop", { id: this.id });
      }
    }
    if (this.body.velocity.x > 0) {
      this.anims.play("right-idle", true);
      this.setVelocity(0, 0);
    } else if (this.body.velocity.x < 0) {
      this.anims.play("left-idle", true);
      this.setVelocity(0, 0);
    } else if (this.body.velocity.y > 0) {
      this.anims.play("down-idle", true);
      this.setVelocity(0, 0);
    } else if (this.body.velocity.y < 0) {
      this.anims.play("up-idle", true);
      this.setVelocity(0, 0);
    }
  }
}
