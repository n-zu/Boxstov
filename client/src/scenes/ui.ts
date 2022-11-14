import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster";
import { World } from "../objects/world";
import { loadUIAssets } from "./load";

class Points {
  kills: Phaser.GameObjects.Text;
  points: Phaser.GameObjects.Text;
  bar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.kills = scene.add.text(10, 10, "Kills: 0", {
      fontFamily: "system-ui",
      fontSize: "40px",
    });
    this.points = scene.add.text(10, 50, "Multiplier", {
      fontFamily: "system-ui",
      fontSize: "30px",
    });

    this.bar = scene.add.graphics();
    this.barFill(0);

    this.kills.setDepth(9999);
    this.points.setDepth(9999);
  }

  barFill(fill: number) {
    this.bar.clear();
    this.bar.fillStyle(0x000000, 0.5);
    this.bar.fillRect(10, 85, 110, 5);
    this.bar.fillStyle(0xffffff, 1);
    this.bar.fillRect(10, 85, 110 * fill, 5);
  }

  update(kills: number, points: number) {
    this.kills.setText(`Kills: ${kills}`);
    this.points.setText(`Rage: x${Math.ceil(points)}`);

    this.barFill(points % 1);
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
    this.points?.update(this.world?.kills || 0, this.world?.points || 0);
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
