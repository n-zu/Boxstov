import geckos, { ClientChannel } from "@geckos.io/client";

const SERVER_PORT = 9208;

export type BaseMessage = { [id: number | string]: any };

export type Message =
  | {
      type: string;
      payload: Message | BaseMessage;
    }
  | BaseMessage;

export type Action = {
  type: string;
  action: (arg?: any) => void;
};

export class GuestMaster {
  actions: Action[] = [];
  channel: ClientChannel;

  constructor() {
    this.channel = geckos({
      url: process.env.SERVER_URL,
      port: SERVER_PORT,
    });

    this.channel.onConnect((error) => {
      if (error) console.error(error.message);

      this.channel.on("msg", (msg: any) => {
        const message = msg as Message;
        this.actions
          .find((action) => action.type === message.type)
          ?.action(message.payload);
      });
    });
  }

  public addAction(type: string, action: (arg?: any) => void) {
    this.actions.push({ type, action });
  }

  public send(type: string, payload: Message) {
    const msg = {
      type,
      payload,
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
