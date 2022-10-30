import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import { Player } from "../objects/player";
import { Direction } from "../../typings/direction";

let lasShot = 0;

interface LetterKeys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

export class PlayerControls {
  cursorKeys: CursorKeys;
  letterKeys: LetterKeys;
  player: Player;

  constructor(player: Player) {
    this.cursorKeys = player.scene.input.keyboard.createCursorKeys();
    this.letterKeys = player.scene.input.keyboard.addKeys(
      "W,A,S,D"
    ) as LetterKeys;
    this.player = player;
  }

  private down(): boolean {
    return this.cursorKeys.down.isDown || this.letterKeys.S.isDown;
  }

  private up(): boolean {
    return this.cursorKeys.up.isDown || this.letterKeys.W.isDown;
  }

  private left(): boolean {
    return this.cursorKeys.left.isDown || this.letterKeys.A.isDown;
  }

  private right(): boolean {
    return this.cursorKeys.right.isDown || this.letterKeys.D.isDown;
  }

  update() {
    if (this.down() && this.left()) {
      this.player.move(Direction.DownLeft);
    } else if (this.down() && this.right()) {
      this.player.move(Direction.DownRight);
    } else if (this.up() && this.left()) {
      this.player.move(Direction.UpLeft);
    } else if (this.up() && this.right()) {
      this.player.move(Direction.UpRight);
    } else if (this.down()) {
      this.player.move(Direction.Down);
    } else if (this.up()) {
      this.player.move(Direction.Up);
    } else if (this.left()) {
      this.player.move(Direction.Left);
    } else if (this.right()) {
      this.player.move(Direction.Right);
    } else {
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
}
