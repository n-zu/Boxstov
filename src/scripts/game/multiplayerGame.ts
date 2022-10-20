import { Game } from "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;

export class MultiplayerGame extends Game {
  playerId: string | undefined;
  socketId: string | undefined;
  idToConnect: string | undefined;

  constructor(config: GameConfig, socketId?: string, idToConnect?: string) {
    console.log("Creating game");
    console.log("Socket id: " + socketId);
    console.log("Id to connect: " + idToConnect);

    super(config);
    this.socketId = socketId;
    this.idToConnect = idToConnect;
  }
}
