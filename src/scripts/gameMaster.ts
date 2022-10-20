import Peer, { DataConnection } from "peerjs";
import MainScene from "./scenes/mainScene";

export type Direction = "up" | "down" | "left" | "right";

export class GameMaster {
  peer: Peer;
  socket: DataConnection | undefined;
  scene: MainScene;

  constructor(scene: MainScene, socketId?: string, idToConnect?: string) {
    this.scene = scene;

    this.peer = this.createPeer(socketId);
    if (idToConnect) {
      this.connectTo(idToConnect);
    } else {
      this.waitForConnection();
    }

    if (idToConnect === undefined) {
      setInterval(() => {
        this.socket?.send({
          type: "sync",
          time: Date.now(),
          state: this.scene.getState(),
        });
      }, 500);
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
      console.log("Connecting to id: " + id);
      this.socket = this.peer.connect(id);

      this.socket?.on("open", () => {
        console.log("Connection established with id: " + id);
        this.socket?.send("Hello from " + this.peer.id);
        console.log("Socket? " + this.socket);
        if (this.socket) {
          this.socket.on("data", (data) => {
            console.log("Data received");
            console.log(data);
            this.handleMessage(data);
          });
        }
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
    } else if (data.type == "shoot") {
      console.log("Shoot message received");
      this.scene.shoot(data.playerId, data.x, data.y);
    } else if (data.type == "stop") {
      console.log("Stop message received");
      this.scene.stop(data.playerId);
    } else if (data.type == "sync") {
      console.log("Sync message received");
      this.scene.sync(data.state);
    }
  }

  waitForConnection() {
    console.log("Waiting for connection (HostId: " + this.peer.id + ")");
    this.peer.on("connection", (conn) => {
      console.log("Opened connection with id: " + conn.peer);
      this.socket = conn;
      this.socket?.on("open", () => {
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

  public shoot(playerId: number, x: number, y: number) {
    console.log("Sending shoot message");
    this.socket?.send({
      type: "shoot",
      playerId: playerId,
      x: x,
      y: y,
    });
  }

  public stop(playerId: number) {
    this.socket?.send({
      type: "stop",
      playerId: playerId,
    });
  }
}
