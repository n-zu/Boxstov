import { Game } from "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MultiplayerGame extends Game {
  playerId: number;
  hostId: string;

  constructor(config: GameConfig, playerId: number, hostId: string) {
    super(config);
    this.playerId = playerId;
    this.hostId = hostId;
  }

  public getPlayerId(): number {
    return this.playerId;
  }
}
