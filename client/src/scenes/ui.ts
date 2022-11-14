import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster";
import { World } from "../objects/world";
import { loadUIAssets } from "./load";

class Points {
  points: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.points = scene.add.text(10, 10, "Hello World", {
      fontFamily: "system-ui",
      fontSize: "40px",
    });

    this.points.setDepth(9999);
  }

  update(points: number) {
    this.points.setText(`Points: ${points.toFixed(2)}`);
  }
}
export default class UI extends Phaser.Scene {
  gameMaster?: GameMaster;
  world?: World;
  points?: Points;

  constructor() {
    super({ key: "UI" });
  }

  create(data: { gameMaster: GameMaster; world: World }) {
    this.gameMaster = data.gameMaster;
    this.addJoinUrl();
    const game_points = new Points(this);
    this.points = game_points;
    this.world = data.world;
    // TODO: Why doesnt this work?
    /*data.gameMaster.addAction("sync", (state) => {
      console.log("sync", state);
      game_points.update(state.points);
    });*/
  }

  preload() {
    loadUIAssets(this);
  }

  update() {
    this.points?.update(this.world?.points || 0);
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
