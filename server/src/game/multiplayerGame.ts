import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { GameMaster } from "../gameMaster/gameMaster.js";
import http from "http";
import { config } from "../config.js";

export class MultiplayerGame extends Phaser.Game {
  gameMaster: GameMaster;

  constructor(server: http.Server, gameMaster: GameMaster) {
    super(config);
    // TODO: need to learn how to pass the gameMaster to the scene without relying on this
    this.gameMaster = gameMaster;
  }
}
