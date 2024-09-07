import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import InputPlugin = Phaser.Input.InputPlugin;
import { Direction, UnitVector } from "../../../common/types/direction";
import Observer from "../../../common/observer/observer.js";
import { Player } from "../objects/player.js";
import { GunName } from "../../../common/guns/gun";
import { GameEvents } from "../../../common/types/events";

const diagonalFactor = Math.sqrt(2) / 2;

// zoom-in: MAX_ZOOM is closest to player, MIN_ZOOM furthest
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1;

interface LetterKeys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

const GUN_NAMES = ["rifle", "shotgun", "rpg"] as GunName[];

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
        const name = GUN_NAMES[num];
        localPlayer.switchGun(name);
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

  update(player: Player) {
    const direction = this.getKeysDirection();
    player.move(direction);

    if (this.wantsToShoot()) {
      player.shoot();
    }
  }

  private setUpCameraFor(scene: Phaser.Scene, player: Player) {
    scene.cameras.main.startFollow(player);
    scene.cameras.main.zoom = 0.6;

    scene.input.on("wheel", (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      scene.cameras.main.zoom -= deltaY * 0.001;
      if (scene.cameras.main.zoom < MIN_ZOOM) scene.cameras.main.zoom = MIN_ZOOM;
      if (scene.cameras.main.zoom > MAX_ZOOM) scene.cameras.main.zoom = MAX_ZOOM;
    });
  }

  private wantsToShoot(): boolean {
    return this.cursorKeys.space.isDown || this.input.activePointer.isDown;
  }

  private getKeysDirection(): Direction | undefined {
    if (!document.hasFocus()) return undefined;

    let horizontal = +this.right() - +this.left();
    let vertical = +this.down() - +this.up();
    if (horizontal === 0 && vertical === 0) return undefined;

    if (horizontal === 1 && vertical === 1) {
      return Direction.DownRight;
    } else if (horizontal === 1 && vertical === -1) {
      return Direction.UpRight;
    } else if (horizontal === -1 && vertical === 1) {
      return Direction.DownLeft;
    } else if (horizontal === -1 && vertical === -1) {
      return Direction.UpLeft;
    } else if (horizontal === 1) {
      return Direction.Right;
    } else if (horizontal === -1) {
      return Direction.Left;
    } else if (vertical === 1) {
      return Direction.Down;
    } else if (vertical === -1) {
      return Direction.Up;
    } else {
      return undefined;
    }
  }
}
