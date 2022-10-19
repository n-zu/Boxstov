import MainScene from "./mainScene";
import { DataConnection, Peer } from "peerjs";
import { PlayerState } from "../objects/player";

export type PlayerUpdateMsg = {
  playerId: number;
  playerState: PlayerState;
};

export class HostMainScene extends MainScene {
  conn: DataConnection | undefined;

  constructor() {
    super();
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    this.connect();
  }

  update() {
    super.update();
    if (this.conn) {
      console.log("Sending world state");
      this.conn.send(this.getWorldState());
    }
  }

  private connect() {
    console.log("Setting up host");
    const peer = new Peer(this.game.hostId);
    peer.on("connection", (conn) => {
      console.log("Opened connection with id: " + conn.peer);
      this.conn = conn;
      this.conn.on("open", () => {
        console.log("Connection opened");
        if (this.conn) {
          this.conn.on("data", (data) => {
            this.handleMessage(data as PlayerUpdateMsg);
          });
        }
      });
    });
  }

  private handleMessage(msg: PlayerUpdateMsg) {
    this.world.updatePlayer(msg.playerId, msg.playerState);
  }
}
