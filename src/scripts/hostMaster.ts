import { GameMaster } from "./gameMaster";
import Peer, { DataConnection } from "peerjs";

export type Message = {
  type: string;
  data: any;
};

export class HostMaster extends GameMaster {
  guest_sockets: DataConnection[] = [];

  constructor(hostId?: string) {
    super(hostId);

    this.peer.on("open", (hostId) => {
      addUrl(hostId);
    });
  }

  public start() {
    this.peer.on("connection", (socket) => {
      this.guest_sockets.push(socket);
      this.setupSocket(socket);
    });
  }

  createPeer(socketId?: string): Peer {
    if (socketId) {
      return new Peer(socketId);
    } else {
      return new Peer();
    }
  }

  public send(type: string, data: any) {
    let msg = {
      type,
      data,
    } as Message;

    this.guest_sockets.forEach((socket) => {
      socket.send(msg);
    });
  }

  protected setupSocket(socket: DataConnection) {
    socket.on("data", (data) => {
      console.log("Received message", data);
      const msg = data as Message;
      this.actions.forEach((action) => {
        if (action.type === msg.type) {
          action.action(msg.data);
        }
      });
      this.guest_sockets.forEach((other_socket) => {
        if (socket !== other_socket) {
          other_socket.send(msg);
        }
      });
    });
  }
}

function addUrl(id: string) {
  const loc = window.location.href;
  const url = `${loc.split("play")[0]}play?id=${id}`;
  const anchor = document.getElementById("joinLink") as HTMLAnchorElement;
  anchor.href = url;
  const text = document.getElementById("joinText") as HTMLHeadingElement;
  text.innerText = `Join with URL: ${url}`;

  anchor.onclick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    text.innerText = "Copied to Clipboard!";
    setTimeout(() => {
      text.innerText = `Join with URL: ${url}`;
    }, 1000);
  };
}
