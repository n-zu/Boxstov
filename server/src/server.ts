import { ServerChannel } from "@geckos.io/server";
import http from "http";
import { Create, Join } from "../../common/types/packet.js";
import { MultiplayerGame } from "./game/multiplayerGame.js";
import { HostMaster } from "./gameMaster/hostMaster.js";
import { SessionMaster } from "./gameMaster/sessionMaster.js";

type Session = {
  game: MultiplayerGame;
  master: SessionMaster;
};

export default class GameServer {
  games: { [key: string]: Session } = {};
  hostMaster: HostMaster;

  constructor(server: http.Server) {
    this.hostMaster = new HostMaster(server);

    this.hostMaster.addCallback("createGame", (channel, payload) => {
      this.onCreate(channel, payload);
    });

    this.hostMaster.addCallback("joinGame", (channel, payload) => {
      this.onJoin(channel, payload);
    });
  }

  private generateGameId(): string {
    let id = "";
    do {
      id = Math.random().toString(36).substring(2, 7);
    } while (this.games[id]);
    return id;
  }

  private onCreate(channel: ServerChannel, data: Create) {
    const id = this.generateGameId();
    const session = new SessionMaster(id, this.hostMaster);
    const game = new MultiplayerGame(session, () => {
      game.destroy(false);
      delete this.games[id];
    });
    this.games[id] = {
      game,
      master: session
    };
    game.addPlayer(data.username);
    session.addMember(channel);
  }

  private onJoin(channel: ServerChannel, data: Join) {
    const session = this.games[data.gameId];
    if (!session) {
      this.hostMaster.send(channel, "invalidId", undefined, true);
      return;
    }
    if (!session.game.addPlayer(data.username)) {
      this.hostMaster.send(channel, "nameTaken", undefined, true);
      return;
    }
    session.master.addMember(channel);
  }
}
