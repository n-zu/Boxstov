import Peer from "peerjs";
import { Game } from "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MultiplayerGame extends Game {
  playerId: number;
  hostId: string;
  peer: Peer;

  constructor(
    config: GameConfig,
    playerId: number,
    hostId: string,
    peer: Peer
  ) {
    super(config);
    this.playerId = playerId;
    this.hostId = hostId;
    this.peer = peer;
  }

  public getPlayerId(): number {
    return this.playerId;
  }
}
