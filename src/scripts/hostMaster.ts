import { GameMaster } from "./gameMaster";
import Peer, { DataConnection } from "peerjs";
import { addUrl } from "./play";

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
    const msg = {
      type,
      data,
    } as Message;

    this.guest_sockets.forEach((socket) => {
      socket.send(msg);
    });
  }

  protected setupSocket(socket: DataConnection) {
    socket.on("data", (data) => {
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
