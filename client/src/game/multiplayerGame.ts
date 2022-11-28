import { Game } from "phaser";
import { GuestMaster } from "../gameMaster/guestMaster";
import LoadScene from "../scenes/load";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MultiplayerGame extends Game {
  constructor(config: GameConfig, guestMaster: GuestMaster) {
    super(config);
    this.scene.add("Loading", LoadScene, true, { guestMaster });
  }
}
