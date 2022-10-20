import Peer, { DataConnection } from "peerjs";
import { Player } from "./objects/player";
import MainScene from "./scenes/mainScene";

export type Direction = "up" | "down" | "left" | "right";

export class GameMaster {
  peer: Peer;
  socket: DataConnection | undefined;
  guest_sockets: DataConnection[] | undefined;
  scene: MainScene;

  constructor(scene: MainScene, socketId?: string, idToConnect?: string) {
    this.scene = scene;
    this.guest_sockets = idToConnect ? undefined : [];

    this.peer = this.createPeer(socketId);
    if (idToConnect) {
      this.connectTo(idToConnect);
    } else {
      this.waitForConnection();
    }

    if (idToConnect === undefined) {
      setInterval(() => {
        this.guest_sockets?.forEach((socket) => {
          socket?.send({
            type: "sync",
            time: Date.now(),
            state: this.scene.getState(),
          });
        }, 500);
      });
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
      this.scene.world.players[0].id = this.peer.id;
      this.scene.game.playerId = this.peer.id;

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

  async waitForConnection() {
    console.log("Waiting for connection (HostId: " + this.peer.id + ")");

    this.peer.on("open", (peerId) => {
      this.scene.world.players[0].id = peerId;
      this.scene.game.playerId = peerId;
      addUrl(peerId);
    });

    this.peer.on("connection", (conn) => {
      console.log("Opened connection with id: " + conn.peer);
      this.scene.world.players.push(
        new Player(this.scene, 100, 100, conn.peer)
      );
      const socket = conn;
      socket?.on("open", () => {
        socket?.on("data", (data) => {
          console.log("Data received");
          console.log(data);
          this.handleMessage(data);
        });
      });
      this.guest_sockets?.push(socket);
    });
  }

  public move(playerId: string, direction: Direction) {
    this.socket?.send({
      type: "move",
      playerId: playerId,
      direction: direction,
    });
  }

  public shoot(playerId: string, x: number, y: number) {
    console.log("Sending shoot message");
    this.socket?.send({
      type: "shoot",
      playerId: playerId,
      x: x,
      y: y,
    });
  }

  public stop(playerId: string) {
    this.socket?.send({
      type: "stop",
      playerId: playerId,
    });
  }
}

function addUrl(id: string) {
  const loc = window.location.href;
  const url = `${loc.split("play")[0]}play?id=${id}`;
  const anchor = document.getElementById("joinLink");
  if (anchor instanceof HTMLAnchorElement) {
    anchor.href = url;
  }
  const text = document.getElementById("joinText") as HTMLHeadingElement;
  text.innerText = `Join with URL: ${url}`;

  //@ts-ignore
  anchor.onclick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    text.innerText = "Copied to Clipboard!";
    // reset after a second
    setTimeout(() => {
      text.innerText = `Join with URL: ${url}`;
    }, 1000);
  };
}
