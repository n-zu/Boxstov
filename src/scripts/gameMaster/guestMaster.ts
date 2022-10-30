import { DataConnection } from "peerjs";
import { Action, GameMaster } from "./gameMaster";
import { Message } from "./hostMaster";

export class GuestMaster extends GameMaster {
  hostId: string;
  socket: DataConnection | undefined;
  actions: Action[] = [];

  constructor(idToConnect: string, id?: string) {
    super();
    this.peer = this.createPeer(id);
    this.hostId = idToConnect;
  }

  public start() {
    this.peer.on("open", () => {
      this.socket = this.peer.connect(this.hostId);
      this.socket.on("open", () => {
        console.log("Connected to host");
        if (this.socket) {
          this.setupSocket(this.socket);
        }
      });
    });
  }

  public addAction(type: string, action: (any) => void) {
    this.actions.push({ type, action });
  }

  public send(type: string, payload: Message) {
    const msg = {
      type,
      payload
    } as Message;
    this.send_async(msg);
  }

  public broadcast(type: string, payload: Message) {
    // Do nothing because this is a guest
  }

  shouldSendSync(): boolean {
    return false;
  }

  protected setupSocket(socket: DataConnection) {
    socket.on("data", (data) => {
      const msg = data as Message;
      this.actions.forEach((action) => {
        if (action.type === msg.type) {
          action.action(msg.payload);
        }
      });
    });
  }

  private async send_async(msg: Message) {
    if (this.socket) {
      this.socket.send(msg);
    }
  }
}
