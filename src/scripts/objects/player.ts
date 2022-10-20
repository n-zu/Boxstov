import MainScene from "../scenes/mainScene";
import { World } from "./world";
import { GameMaster } from "../gameMaster";
import Sprite = Phaser.Physics.Arcade.Sprite;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

const SPEED = 30;

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

  updateStop(cursorKeys: CursorKeys) {
    if (
      !cursorKeys.up.isDown &&
      !cursorKeys.down.isDown &&
      !cursorKeys.left.isDown &&
      !cursorKeys.right.isDown
    ) {
      this.setVelocity(0, 0);
    }
  }

  updateUp(cursorKeys: CursorKeys) {
    if (cursorKeys.up.isDown) {
      this.gameMaster.move(this.id, "up");
      this.moveUp();
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
    this.gameMaster.shoot(this.id, angle);
    world.spawnBullet(this.x, this.y, angle);
  }
}
