import Peer, { DataConnection } from "peerjs";
import MainScene from "./scenes/mainScene";

export type Direction = "up" | "down" | "left" | "right";

export class GameMaster {
  peer: Peer;
  socket: DataConnection;
  scene: MainScene;

  constructor(scene: MainScene, socketId?: string, idToConnect?: string) {
    this.scene = scene;

    this.peer = this.createPeer(socketId);
    if (idToConnect) {
      this.connectTo(idToConnect);
    } else {
      this.waitForConnection();
    }
  }

  createPeer(socketId?: string): Peer {
    if (socketId) {
      return new Peer(socketId);
    } else {
      return new Peer();
    }
  }

  connectTo(id: string) {
    this.peer.on("open", () => {
      this.socket = this.peer.connect(id);
      this.socket.on("open", () => {
        console.log("Connection established with id: " + id);
        this.socket.send("Hello from " + this.peer.id);
        console.log("Socket? " + this.socket);
        this.socket?.on("data", (data) => {
          console.log("Data received");
          console.log(data);
          this.handleMessage(data);
        });
      });
    });
  }

  handleMessage(data: any) {
    if (data.type == "move") {
      console.log("Move message received");
      switch (data.direction) {
        case "up":
          this.scene.movePlayerUp(data.playerId);
          break;
        case "down":
          this.scene.movePlayerDown(data.playerId);
          break;
        case "left":
          this.scene.movePlayerLeft(data.playerId);
          break;
        case "right":
          this.scene.movePlayerRight(data.playerId);
          break;
      }
    }
  }

  waitForConnection() {
    console.log("Waiting for connection (HostId: " + this.peer.id + ")");
    this.peer.on("connection", (conn) => {
      console.log("Opened connection with id: " + conn.peer);
      this.socket.on("open", () => {
        this.socket?.on("data", (data) => {
          console.log("Data received");
          console.log(data);
          this.handleMessage(data);
        });
      });
    });
  }

  public move(playerId: number, direction: Direction) {
    this.socket?.send({
      type: "move",
      playerId: playerId,
      direction: direction,
    });
  }

  public shoot(playerId: number, angle: number) {
    console.log("Sending shoot message");
    this.socket?.send({
      type: "shoot",
      playerId: playerId,
      angle: angle,
    });
  }
}
