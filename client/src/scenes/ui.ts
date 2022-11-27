import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../../../common/constants";
import { GameMaster } from "../gameMaster/gameMaster";
import { Enemy } from "../objects/enemy";
import { World } from "../objects/world";
import { loadUIAssets } from "./load";

class Points {
  kills: Phaser.GameObjects.Text;
  rage: Phaser.GameObjects.Text;
  bar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.kills = scene.add.text(10, 10, "Kills: 0", {
      fontFamily: "system-ui",
      fontSize: "40px",
    });
    this.rage = scene.add.text(10, 50, "Multiplier", {
      fontFamily: "system-ui",
      fontSize: "30px",
    });

    this.bar = scene.add.graphics();
    this.barFill(0);

    this.kills.setDepth(9999);
    this.rage.setDepth(9999);
  }

  barFill(fill: number) {
    this.bar.clear();
    this.bar.fillStyle(0x000000, 0.5);
    this.bar.fillRect(10, 85, 110, 5);
    this.bar.fillStyle(0xffffff, 1);
    this.bar.fillRect(10, 85, 110 * fill, 5);
  }

  update(kills: number, rage: number) {
    this.kills.setText(`Kills: ${kills}`);
    this.rage.setText(`Rage: x${Math.ceil(rage)}`);

    this.barFill(rage % 1);
  }
}

class MiniMap {
  scene: Phaser.Scene;
  map: Phaser.GameObjects.Graphics;
  players: Phaser.GameObjects.Graphics;
  enemies: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.map = scene.add.graphics();
    this.players = scene.add.graphics();
    this.enemies = scene.add.graphics();

    this.map.setDepth(9999);
    this.players.setDepth(9999);
  }

  update(world?: World) {
    if (!world) return;
    this.map.clear();
    this.map.fillStyle(0x000000, 0.5);
    this.map.fillRect(10, 100, 110, 110);

    this.players.clear();
    this.players.fillStyle(0xffffff, 1);
    world.players.forEach((player) => {
      const px = (player.x * 110) / GAME_WIDTH;
      const py = (player.y * 110) / GAME_HEIGHT;

      this.players.fillRect(10 + 55 + px, 100 + 55 + py, 2, 2);
    });

    this.enemies.clear();
    this.enemies.fillStyle(0xff5555, 1);
    world.enemies.getChildren().forEach((enemy) => {
      const e = enemy as Enemy;
      if (!e.active || e.dead) return;
      const ex = (e.x * 110) / GAME_WIDTH;
      const ey = (e.y * 110) / GAME_HEIGHT;
      this.enemies.fillRect(10 + 55 + ex, 100 + 55 + ey, 2, 2);
    });
  }
}
export default class UI extends Phaser.Scene {
  gameMaster?: GameMaster;
  world?: World;
  points?: Points;
  minimap?: MiniMap;

  constructor() {
    super({ key: "UI" });
  }

  create(data: { gameMaster: GameMaster; world: World }) {
    this.gameMaster = data.gameMaster;
    this.addJoinUrl();
    const game_points = new Points(this);
    this.points = game_points;
    this.world = data.world;
    this.minimap = new MiniMap(this);

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
    this.points?.update(this.world?.kills || 0, this.world?.rage || 0);
    this.minimap?.update(this.world);
  }

  private addJoinUrl() {
    const loc = window.location;
    const url = `${loc.protocol}//${loc.host}${loc.pathname}
      ?join=${this.gameMaster?.getGameId()}`;

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
