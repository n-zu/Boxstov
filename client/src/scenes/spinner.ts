import Phaser from "phaser";
import { loadSpinnerAssets } from "./load";

export default class Spinner extends Phaser.Scene {
  spinner?: Phaser.GameObjects.Sprite;
  dark?: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "Spinner" });
  }

  create() {
    this.addSpinner();
  }

  preload() {
    loadSpinnerAssets(this);
  }

  private addSpinner() {
    const height = this.cameras.main.height;
    const width = this.cameras.main.width;
    this.dark = this.add
      .graphics()
      .fillStyle(0x000000, 0.5)
      .fillRect(0, 0, width, height);
    this.spinner = this.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "spinner")
      .setScale(0.3);
    this.spinner.anims.play("spinner");
  }
}
