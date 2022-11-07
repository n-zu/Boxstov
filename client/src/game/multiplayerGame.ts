import { Game } from "phaser";
import { GuestMaster } from "../gameMaster/guestMaster";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MultiplayerGame extends Game {
  gameMaster: GuestMaster;

  constructor(config: GameConfig, gameMaster: GuestMaster) {
    super(config);
    // TODO: need to learn how to pass the gameMaster to the scene without relying on this
    this.gameMaster = gameMaster;
  }
}
