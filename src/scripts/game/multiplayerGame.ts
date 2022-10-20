import { Game } from "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MultiplayerGame extends Game {
  playerId: number;
  socketId: string | undefined;
  idToConnect: string | undefined;

  constructor(
    config: GameConfig,
    playerId: number,
    socketId?: string,
    idToConnect?: string
  ) {
    console.log("Creating game");
    console.log("Player id: " + playerId);
    console.log("Socket id: " + socketId);
    console.log("Id to connect: " + idToConnect);

    super(config);
    this.playerId = playerId;
    this.socketId = socketId;
    this.idToConnect = idToConnect;
  }
}
