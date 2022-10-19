import MainScene from "./mainScene";
import { DataConnection, Peer } from "peerjs";
import { WorldState } from "../objects/world";

export class GuestMainScene extends MainScene {
  conn: DataConnection | undefined;
  peer: Peer;

  constructor() {
    super();
    this.peer = new Peer();
  }

  preload() {
    super.preload();
  }

  update() {
    super.update();
    if (this.conn) {
      console.log("Sending player state");
      let msg = {
        playerId: this.game.getPlayerId(),
        playerState: this.world.getPlayerState(this.game.getPlayerId()),
      };
      this.conn.send(msg);
    }
  }

  create() {
    super.create();
    this.peer.on("open", () => {
      console.log("Guest peer id: " + this.peer.id);
      console.log("Connecting with host: " + this.game.hostId);
      this.conn = this.peer.connect(this.game.hostId);
      this.conn.on("open", () => {
        console.log("Connection opened");
        if (this.conn) {
          this.conn.on("data", (data) => {
            console.log("Received data: " + data);
            this.world.updateFor(this.game.getPlayerId(), data as WorldState);
          });
        }
      });
    });
  }

  private openConnection(): DataConnection {
    const peer = new Peer();
    return peer.connect(this.game.hostId);
  }
}
