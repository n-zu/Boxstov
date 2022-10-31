import { GameMaster } from "./gameMaster.js";
import {Peer, DataConnection } from "peerjs";

export type BaseMessage = { [id: number | string]: any };

export type Message = {
  type: string;
  payload: Message | BaseMessage;
} | BaseMessage;

export class HostMaster extends GameMaster {
  guest_sockets: DataConnection[] = [];

  constructor(hostId?: string) {
    console.log("host master");
    super(hostId);
    console.log("After super");
  }

  public start() {
    // @ts-ignore
    this.peer.on("connection", (socket) => {
      console.log("connection with guest");
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

  public broadcast(type: string, payload: Message) {
    const msg = {
      type,
      payload
    } as Message;


    this.guest_sockets.forEach((socket) => {
      this.send_async(socket, msg);
    });
  }

  shouldSendSync(): boolean {
    return true;
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
        this.send_async(otherSocket, msg);
      });
    });
  }

  private async send_async(socket: DataConnection, msg: Message) {
    socket.send(msg);
  }
}
