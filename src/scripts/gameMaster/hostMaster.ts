import { GameMaster } from "./gameMaster";
import { DataConnection } from "peerjs";
import { addUrl } from "../play";
import { MessageType, Message, Update } from "../../typings/action";

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

  public send(type: MessageType, payload: Update) {
    const msg = {
      type,
      payload,
    } as Message;

    this.guest_sockets.forEach((socket) => {
      socket.send(msg);
    });
  }

  public broadcast(type: string, payload: Update) {
    const msg = {
      type,
      payload,
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
