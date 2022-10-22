import { Game } from "phaser";
import { GameMaster } from "../gameMaster";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MultiplayerGame extends Game {
  gameMaster: GameMaster;

  constructor(config: GameConfig, gameMaster: GameMaster) {
    super(config);
    // TODO: need to learn how to pass the gameMaster to the scene without relying on this
    this.gameMaster = gameMaster;
  }
}
