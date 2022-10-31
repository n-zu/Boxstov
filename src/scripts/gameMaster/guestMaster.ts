import { DataConnection } from "peerjs";
import {
  Action,
  Message,
  MessageType,
  Update,
  UpdateFor,
} from "../../typings/action";
import { GameMaster } from "./gameMaster";

const SYNC_TIMEOUT = 500;

export class GuestMaster extends GameMaster {
  hostId: string;
  socket: DataConnection | undefined;
  actions: Action[] = [];
  rtt: number = 50;
  lastUpdate = Date.now();
  syncTimeout: NodeJS.Timeout | undefined;

  constructor(idToConnect: string, id?: string) {
    super();
    this.peer = this.createPeer(id);
    this.hostId = idToConnect;

    this.addAction("sync", () => {
      this.request_sync();
    });
  }

  public request_sync() {
    clearTimeout(this.syncTimeout);

    const now = Date.now();
    const last_rtt = now - this.lastUpdate;
    this.lastUpdate = now;
    this.rtt = 0.9 * this.rtt + 0.1 * last_rtt;
    console.log("RTT: ", this.rtt);

    this.send("sync-request", undefined);
    this.syncTimeout = setTimeout(() => {
      this.request_sync();
    }, SYNC_TIMEOUT);
  }

  public getRTT() {
    return this.rtt;
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

  public send<T extends MessageType>(type: T, payload: UpdateFor<T>) {
    const msg: Message = {
      type,
      payload,
    };
    this.send_async(msg);
  }

  public broadcast(_type: string, _payload: Update) {
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
