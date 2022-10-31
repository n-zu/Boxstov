import "@geckos.io/phaser-on-nodejs"
import pkg from "phaser";
const {Game} = pkg;
import { GameMaster } from "../gameMaster/gameMaster.js";
import http from "http";
import {config} from "../config.js";

export class MultiplayerGame extends Game {
  gameMaster: GameMaster;

  constructor(server: http.Server, gameMaster: GameMaster) {
    super(config);
    // TODO: need to learn how to pass the gameMaster to the scene without relying on this
    this.gameMaster = gameMaster;
  }
}
