import geckos, { ClientChannel } from "@geckos.io/client";
import {
  Action,
  ActionFnFor,
  Message,
  UpdateFor,
  UpdateType,
} from "../../../common/types/messages";

const SERVER_PORT = 9208;

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

  public addAction<T extends UpdateType>(type: T, action: ActionFnFor<T>) {
    this.actions.push({ type, action });
  }

  public send<T extends UpdateType>(type: T, payload: UpdateFor<T>) {
    const msg = {
      type,
      payload,
    };

    this.send_async(msg);
  }

  private async send_async(msg: Message) {
    this.channel.emit("msg", msg);
  }
}
