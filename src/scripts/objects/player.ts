import Sprite = Phaser.Physics.Arcade.Sprite;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

const SPEED = 10;

export type PlayerState = {
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
  cursorKeys: CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
  }

  public update() {
    this.updateLeft();
    this.updateRight();
    this.updateUp();
    this.updateDown();
    this.updateStop();
  }

  public updateStop() {
    if (
      !this.cursorKeys.up.isDown &&
      !this.cursorKeys.down.isDown &&
      !this.cursorKeys.left.isDown &&
      !this.cursorKeys.right.isDown
    ) {
      this.setVelocity(0, 0);
    }
  }

  updateUp() {
    if (this.cursorKeys.up.isDown) {
      this.setVelocityY(-SPEED);
    }
  }

  updateDown() {
    if (this.cursorKeys.down.isDown) {
      this.setVelocityY(SPEED);
    }
  }

  updateLeft() {
    if (this.cursorKeys.left.isDown) {
      this.setVelocityX(-SPEED);
    }
  }

  updateRight() {
    if (this.cursorKeys.right.isDown) {
      this.setVelocityX(SPEED);
    }
  }

  public getState(): PlayerState {
    return {
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

  public updateWith(playerState: PlayerState) {
    if (playerState.velocity.x === 0 || playerState.velocity.y === 0) {
      this.setPosition(playerState.position.x, playerState.position.y);
    }
    this.setVelocity(playerState.velocity.x, playerState.velocity.y);
    this.setRotation(playerState.rotation);
  }
}
