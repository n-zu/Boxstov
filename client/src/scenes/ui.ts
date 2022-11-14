import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster";
import { loadUIAssets } from "./load";

export default class UI extends Phaser.Scene {
  gameMaster?: GameMaster;

  constructor() {
    super({ key: "UI" });
  }

  create(data: { gameMaster: GameMaster }) {
    this.gameMaster = data.gameMaster;
    this.addJoinUrl();
  }

  preload() {
    loadUIAssets(this);
  }

  private addJoinUrl() {
    const loc = window.location;
    const url = `${loc.protocol}//${
      loc.host
    }/?join=${this.gameMaster?.getGameId()}`;
    const icon = this.add
      .image(0, 0, "invite")
      .setOrigin(1, 1)
      .setPosition(this.cameras.main.width - 10, this.cameras.main.height - 10)
      .setScale(0.1)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        navigator.clipboard.writeText(url);
        const { x, y } = icon.getCenter();
        const txt = this.add
          .text(x, y, "Copied!", {
            color: "white",
            fontSize: "18px",
          })
          .setOrigin(0.5);
        this.tweens.add({
          targets: txt,
          alpha: 0,
          duration: 1000,
          onComplete: () => txt.destroy(),
        });
      })
      .on("pointerover", () => icon.setTintFill(0x383838))
      .on("pointerout", () => icon.clearTint());
  }
}
