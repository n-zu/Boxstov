import { ServerChannel } from "@geckos.io/server";
import http from "http";
import { MultiplayerGame } from "./game/multiplayerGame.js";
import { HostMaster } from "./gameMaster/hostMaster.js";
import { SessionMaster } from "./gameMaster/sessionMaster.js";

export default class GameServer {
  games: { [key: string]: SessionMaster } = {};
  hostMaster: HostMaster;

  constructor(server: http.Server) {
    this.hostMaster = new HostMaster(server);

    this.hostMaster.addCallback("createGame", (channel) => {
      this.onCreate(channel);
    });

    this.hostMaster.addCallback("joinGame", (channel, payload) => {
      this.onJoin(channel, payload.gameId);
    });
  }

  private generateGameId(): string {
    let id = "";
    do {
      id = Math.random().toString(36).substring(2, 7);
    } while (this.games[id]);
    return id;
  }

  private onCreate(channel: ServerChannel) {
    const id = this.generateGameId();
    const session = new SessionMaster(id, this.hostMaster);
    const game = new MultiplayerGame(session, () => {
      game.destroy(true);
      delete this.games[id];
    });
    this.games[id] = session;
    session.addMember(channel);
  }

  private onJoin(channel: ServerChannel, gameId: string) {
    const session = this.games[gameId];
    if (session) {
      session.addMember(channel);
      return;
    }
    this.hostMaster.send(channel, "invalidId", undefined, true);
  }
}
