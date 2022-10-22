import MainScene from "../scenes/mainScene";
import { World } from "./world";
import { GameMaster } from "../gameMaster";
import Sprite = Phaser.Physics.Arcade.Sprite;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

const SPEED = 30;

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
  scene: MainScene;
  gameMaster: GameMaster;
  id: string;

  constructor(
    scene: MainScene,
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

  public shootIn(x: number, y: number, world: World) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    world.createBullet(this.x, this.y, angle);
  }

  public move(direction: "up" | "down" | "left" | "right") {
    switch (direction) {
      case "up":
        this.moveUp();
        break;
      case "down":
        this.moveDown();
        break;
      case "left":
        this.moveLeft();
        break;
      case "right":
        this.moveRight();
        break;
    }
  }

  public sync(state: PlayerState) {
    this.setPosition(state.position.x, state.position.y);
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
    if (state.animation) {
      this.anims.play({
        key: state.animation.key,
        startFrame: state.animation.frame,
        duration: 0,
      });
    }
  }

  public update(cursorKeys: CursorKeys) {
    this.updateLeft(cursorKeys);
    this.updateRight(cursorKeys);
    this.updateUp(cursorKeys);
    this.updateDown(cursorKeys);
    this.updateStop(cursorKeys);
  }

  public moveUp() {
    this.anims.play("up", true);
    this.setVelocityY(-SPEED);
  }

  public moveDown() {
    this.anims.play("down", true);
    this.setVelocityY(SPEED);
  }

  public moveLeft() {
    this.anims.play("left", true);
    this.setVelocityX(-SPEED);
  }

  public moveRight() {
    this.anims.play("right", true);
    this.setVelocityX(SPEED);
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

  updateStop(cursorKeys: CursorKeys) {
    if (
      !cursorKeys.up.isDown &&
      !cursorKeys.down.isDown &&
      !cursorKeys.left.isDown &&
      !cursorKeys.right.isDown
    ) {
      if (this.body.velocity.x > 0) {
        this.anims.play("right-idle", true);
      } else if (this.body.velocity.x < 0) {
        this.anims.play("left-idle", true);
      } else if (this.body.velocity.y > 0) {
        this.anims.play("down-idle", true);
      } else if (this.body.velocity.y < 0) {
        this.anims.play("up-idle", true);
      }

      if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
        this.gameMaster.send("stop", { id: this.id });
      }
    }
  }

  updateUp(cursorKeys: CursorKeys) {
    if (cursorKeys.up.isDown) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "up",
      });
    } else {
      // TODO: if moving up, stop and send message to gameMaster
      // the same with the other directions
    }
  }

  updateDown(cursorKeys: CursorKeys) {
    if (cursorKeys.down.isDown) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "down",
      });
    }
  }

  updateLeft(cursorKeys: CursorKeys) {
    if (cursorKeys.left.isDown) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "left",
      });
    }
  }

  updateRight(cursorKeys: CursorKeys) {
    if (cursorKeys.right.isDown) {
      this.gameMaster.send("move", {
        id: this.id,
        direction: "right",
      });
    }
  }

  public shootInWorld(x: number, y: number, world: World) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    this.gameMaster.send("shoot", { id: this.id, angle: angle });
  }

  public stopMovement() {
    this.setVelocity(0, 0);
  }
}
