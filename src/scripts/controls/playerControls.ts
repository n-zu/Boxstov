import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import { Player } from "../objects/player";
import { Direction } from "../../typings/action";

let lasShot = 0;

export class PlayerControls {
  cursorKeys: CursorKeys;
  player: Player;

  constructor(player: Player) {
    this.cursorKeys = player.scene.input.keyboard.createCursorKeys();
    this.player = player;
  }

  update() {
    const amountOfArrowsDown = this.getAmountOfArrowsDown();
    if (amountOfArrowsDown === 1) {
      if (this.cursorKeys.up.isDown) {
        this.player.move(Direction.Up, true);
      }
      if (this.cursorKeys.down.isDown) {
        this.player.move(Direction.Down, true);
      }
      if (this.cursorKeys.left.isDown) {
        this.player.move(Direction.Left, true);
      }
      if (this.cursorKeys.right.isDown) {
        this.player.move(Direction.Right, true);
      }
    }
    if (amountOfArrowsDown === 2) {
      if (this.cursorKeys.up.isDown && this.cursorKeys.left.isDown) {
        this.player.move(Direction.UpLeft, true);
      }
      if (this.cursorKeys.up.isDown && this.cursorKeys.right.isDown) {
        this.player.move(Direction.UpRight, true);
      }
      if (this.cursorKeys.down.isDown && this.cursorKeys.left.isDown) {
        this.player.move(Direction.DownLeft, true);
      }
      if (this.cursorKeys.down.isDown && this.cursorKeys.right.isDown) {
        this.player.move(Direction.DownRight, true);
      }
    }
    if (amountOfArrowsDown === 0) {
      this.player.stopMovement(true);
    }

    if (this.cursorKeys.space.isDown) {
      if (Date.now() - lasShot > 100) {
        lasShot = Date.now();
        this.player.shoot();
      }
    }

    // if mouse click
    if (this.player.scene.input.activePointer.isDown) {
      const now = Date.now();
      if (now - lasShot > 100) {
        lasShot = now;
        this.player.shoot(true);
      }
    }
  }

  private getAmountOfArrowsDown() {
    let count = 0;
    if (this.cursorKeys.up.isDown) {
      count++;
    }
    if (this.cursorKeys.down.isDown) {
      count++;
    }
    if (this.cursorKeys.left.isDown) {
      count++;
    }
    if (this.cursorKeys.right.isDown) {
      count++;
    }
    return count;
  }
}
