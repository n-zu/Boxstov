import MainScene from "../scenes/mainScene";
import { World } from "./world";
import { GameMaster } from "../gameMaster";
import Sprite = Phaser.Physics.Arcade.Sprite;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

const SPEED = 30;

export type PlayerState = {
  id: number;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  rotation: number;
};

export class Player extends Sprite {
  gameMaster: GameMaster;
  id: number;

  constructor(scene: MainScene, x: number, y: number, id: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.gameMaster = scene.gameMaster;
  }

  public sync(state: PlayerState) {
    this.setPosition(state.position.x, state.position.y);
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
  }

  public update(cursorKeys: CursorKeys) {
    this.updateLeft(cursorKeys);
    this.updateRight(cursorKeys);
    this.updateUp(cursorKeys);
    this.updateDown(cursorKeys);
    this.updateStop(cursorKeys);
  }

  public moveUp() {
    this.setVelocityY(-SPEED);
  }

  public moveDown() {
    this.setVelocityY(SPEED);
  }

  public moveLeft() {
    this.setVelocityX(-SPEED);
  }

  public moveRight() {
    this.setVelocityX(SPEED);
  }

  public getState(): PlayerState {
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
    };
  }

  updateStop(cursorKeys: CursorKeys) {
    if (
      !cursorKeys.up.isDown &&
      !cursorKeys.down.isDown &&
      !cursorKeys.left.isDown &&
      !cursorKeys.right.isDown
    ) {
      if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
        this.gameMaster.stop(this.id);
        this.stopMovement();
      }
    }
  }

  updateUp(cursorKeys: CursorKeys) {
    if (cursorKeys.up.isDown) {
      this.gameMaster.move(this.id, "up");
      this.moveUp();
    } else {
      // TODO: if moving up, stop and send message to gameMaster
      // the same with the other directions
    }
  }

  updateDown(cursorKeys: CursorKeys) {
    if (cursorKeys.down.isDown) {
      this.gameMaster.move(this.id, "down");
      this.moveDown();
    }
  }

  updateLeft(cursorKeys: CursorKeys) {
    if (cursorKeys.left.isDown) {
      this.gameMaster.move(this.id, "left");
      this.moveLeft();
    }
  }

  updateRight(cursorKeys: CursorKeys) {
    if (cursorKeys.right.isDown) {
      this.gameMaster.move(this.id, "right");
      this.moveRight();
    }
  }

  /*
  public updateWith(playerState: PlayerState) {
    if (playerState.velocity.x === 0 || playerState.velocity.y === 0) {
      this.setPosition(playerState.position.x, playerState.position.y);
    }
    this.setVelocity(playerState.velocity.x, playerState.velocity.y);
    this.setRotation(playerState.rotation);
  }
   */

  public shootInWorld(x: number, y: number, world: World) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    this.gameMaster.shoot(this.id, x, y);
    world.spawnBullet(this.x, this.y, angle);
  }

  public stopMovement() {
    this.setVelocity(0, 0);
  }
}
