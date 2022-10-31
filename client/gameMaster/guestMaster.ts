import { Action, GameMaster } from "./gameMaster.js";
import {Message} from "../../server/gameMaster/hostMaster.js";

export class GuestMaster extends GameMaster {
  hostId: string;
  actions: Action[] = [];

  constructor(idToConnect: string, id?: string) {
    super();
    this.hostId = idToConnect;
  }

  public start() {

  }

  public addAction(type: string, action: (arg?: any) => void) {
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
