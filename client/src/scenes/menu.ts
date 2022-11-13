import Phaser from "phaser";
import { loadMenuAssets } from "./load";
import MainScene from "./mainScene";

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "Menu" });
  }

  create() {
    this.add.tileSprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      "squares"
    );
    this.add.sprite(this.cameras.main.centerX, 100, "logo").setScale(0.25);
    this.addPlayButton();
  }

  preload() {
    loadMenuAssets(this);
  }

  private addPlayButton() {
    const button = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Play", {
        font: "30px monospace",
      })
      .setPadding(20, 10)
      .setOrigin(0.5)
      .setStyle({ backgroundColor: "#03989E", fill: "#fff" })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.startGame())
      .on("pointerover", () => button.setStyle({ fill: "#ccc" }))
      .on("pointerout", () => button.setStyle({ fill: "#fff" }));
  }

  private startGame() {
    console.log("Starting game");
    this.scene.add("MainScene", MainScene, true);
  }
}
