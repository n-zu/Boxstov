import {Action, GameMaster, Message} from "./gameMaster";
import {ClientChannel} from "@geckos.io/client";

export class GuestMaster extends GameMaster {
  constructor() {
    super();
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

  private async send_async(msg: Message) {
    this.channel.emit("msg", msg);
  }
}
