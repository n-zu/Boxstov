import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { config } from "../config.js";
import MainScene from "../scenes/mainScene.js";

export class MultiplayerGame extends Phaser.Game {
  mainScene?: MainScene;

  constructor(gameMaster: GameMaster, onEnd: () => void) {
    super(config);
    this.mainScene = this.scene.add("MainScene", MainScene, true, {
      gameMaster,
      onEnd,
    }) as MainScene;
  }

  public addPlayer(id: string): boolean {
    return this.mainScene?.addPlayer(id) || false;
  }
}
