import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { config } from "../config.js";
import MainScene from "../scenes/mainScene.js";

export class MultiplayerGame extends Phaser.Game {
  constructor(gameMaster: GameMaster, onEnd: () => void) {
    super(config);
    this.scene.add("MainScene", MainScene, true, { gameMaster, onEnd });
  }
}
