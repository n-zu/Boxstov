import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import { Player } from "./player";

export class PlayerControls {
  cursorKeys: CursorKeys;
  player: Player;

  constructor(player: Player) {
    this.cursorKeys = player.scene.input.keyboard.createCursorKeys();
    this.player = player;
  }

  update() {
    const amountOfKeysDown = this.getAmountOfKeysDown();
    if (amountOfKeysDown === 1) {
      if (this.cursorKeys.up.isDown) {
        this.player.moveUp(true);
      }
      if (this.cursorKeys.down.isDown) {
        this.player.moveDown(true);
      }
      if (this.cursorKeys.left.isDown) {
        this.player.moveLeft(true);
      }
      if (this.cursorKeys.right.isDown) {
        this.player.moveRight(true);
      }
    }
    if (amountOfKeysDown === 0) {
      this.player.stopMovement(true);
    }
  }

  private getAmountOfKeysDown() {
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
