import '@geckos.io/phaser-on-nodejs';
import { config } from './config.js'
import {Server} from "http";
import {GameMaster} from "./gameMaster/gameMaster.js";

export class MultiplayerGame extends Phaser.Game {
  server: Server
  gameMaster: GameMaster

  constructor(server: Server, gameMaster: GameMaster) {
    super(config)
    this.server = server
    this.gameMaster = gameMaster
  }
}
