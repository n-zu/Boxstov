import { GameMaster } from "./gameMaster";
import Peer, { DataConnection } from "peerjs";
import { addUrl } from "./play";

export type BaseMessage = { [id: number | string]: any };

export type Message = {
  type: string;
  payload: Message | BaseMessage;
} | BaseMessage;

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

  public send(type: string, payload: Message) {
    const msg = {
      type,
      payload
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
          action.action(msg.payload);
        }
      });
      this.guest_sockets.forEach((otherSocket) => {
        if (socket !== otherSocket) {
          otherSocket.send(msg);
        }
      });
    });
  }
}
