import { World } from "./world";
import { GameMaster } from "../gameMaster";
import * as Phaser from "phaser";
import Sprite = Phaser.Physics.Arcade.Sprite;

const SPEED = 30;

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
  id: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    gameMaster: GameMaster
  ) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.scene = scene;
    this.gameMaster = gameMaster;
  }

  public getId() {
    return this.id;
  }

  public move(direction: "up" | "down" | "left" | "right") {
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
    }
  }

  public sync(state: PlayerState) {
    this.setPosition(state.position.x, state.position.y);
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
    if (state.animation) {
      console.log("syncing animation", state.animation);
      // There is a bug here, probably
      // If I set ignoreIfPlaying to false, and then move the guest player, when it
      // receives a sync message, I get the following error:
      // Uncaught TypeError: Cannot read properties of undefined (reading 'duration')
      // It seems that ignoreIfPlaying to true makes the bug less reproducible
      this.anims.play(
        {
          key: state.animation.key,
          startFrame: state.animation.frame,
          frameRate: 30,
          duration: 0,
          repeat: -1,
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

  public shootInWorld(x: number, y: number, world: World) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    this.gameMaster.send("shoot", { id: this.id, angle: angle });
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
