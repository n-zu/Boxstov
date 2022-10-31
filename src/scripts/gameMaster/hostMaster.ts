import { GameMaster } from "./gameMaster";
import { DataConnection } from "peerjs";
import { addUrl } from "../play";
import { MessageType, Message, Update, UpdateFor } from "../../typings/action";
import { WorldState } from "../objects/world";

export class HostMaster extends GameMaster {
  guest_sockets: DataConnection[] = [];
  latest_state?: WorldState;

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

  public send<T extends MessageType>(type: T, payload: UpdateFor<T>) {
    const msg: Message = {
      type,
      payload,
    };

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
        if (msg.type === "sync-request") {
          console.log("Got sync request from ", socket.label);
          this.send_sync(socket);
        }
      });
      this.guest_sockets.forEach((otherSocket) => {
        this.send_async(otherSocket, msg);
      });
    });
  }

  private send_sync(socket: DataConnection) {
    if (!this.latest_state) return;

    const msg: Message = {
      type: "sync",
      payload: this.latest_state,
    };
    socket.send(msg);
  }

  private async send_async(socket: DataConnection, msg: Message) {
    socket.send(msg);
  }

  public updateState(state: WorldState) {
    this.latest_state = state;
  }
}
