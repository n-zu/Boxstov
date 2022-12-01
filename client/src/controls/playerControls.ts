import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import InputPlugin = Phaser.Input.InputPlugin;
import { UnitVector } from "../../../common/types/direction";
import { numToGunName } from "../../../common/guns";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";
import { Player } from "../objects/player.js";

const diagonalFactor = Math.sqrt(2) / 2;

interface LetterKeys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

export class PlayerControls {
  cursorKeys: CursorKeys;
  letterKeys: LetterKeys;
  observer: Observer<GameEvents>;
  input: InputPlugin;

  constructor(scene: Phaser.Scene, localPlayer: Player, observer: Observer<GameEvents>) {
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.letterKeys = scene.input.keyboard.addKeys(
      "W,A,S,D"
    ) as LetterKeys;
    this.observer = observer;
    this.input = scene.input;

    scene.input.keyboard.on("keydown", (event: any) => {
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        const num = event.keyCode - 49;
        const name = numToGunName(num);
        this.observer.notify("triggerChangeGun", name);
      }
    });

    this.setUpCameraFor(scene, localPlayer);
  }

  public down(): boolean {
    return this.cursorKeys.down.isDown || this.letterKeys.S.isDown;
  }

  public up(): boolean {
    return this.cursorKeys.up.isDown || this.letterKeys.W.isDown;
  }

  public left(): boolean {
    return this.cursorKeys.left.isDown || this.letterKeys.A.isDown;
  }

  public right(): boolean {
    return this.cursorKeys.right.isDown || this.letterKeys.D.isDown;
  }

  update() {
    const direction = this.getKeysDirection();
    this.observer.notify("triggerMove", direction);

    if (this.wantsToShoot()) {
      this.observer.notify("triggerShoot");
    }
  }

  private setUpCameraFor(scene: Phaser.Scene, player: Player) {
    scene.cameras.main.startFollow(player);
    scene.cameras.main.zoom = 0.6;

    scene.input.on("wheel", (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      scene.cameras.main.zoom -= deltaY * 0.001;
      if (scene.cameras.main.zoom < 0.2) scene.cameras.main.zoom = 0.2;
      if (scene.cameras.main.zoom > 1) scene.cameras.main.zoom = 1;
    });
  }

  private wantsToShoot(): boolean {
    return this.cursorKeys.space.isDown || this.input.activePointer.isDown;
  }

  private getKeysDirection(): UnitVector {
    if (!document.hasFocus()) return [0, 0];

    let horizontal = +this.right() - +this.left();
    let vertical = +this.down() - +this.up();
    if (horizontal && vertical) {
      horizontal *= diagonalFactor;
      vertical *= diagonalFactor;
    }
    return [horizontal, vertical];
  }
}
