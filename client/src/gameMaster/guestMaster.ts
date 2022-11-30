import geckos, { ClientChannel } from "@geckos.io/client";
import { Action, ServerMessage } from "../../../common/types/messages";
import {
  ClientPacket,
  ClientPacketType,
  PayloadFor,
  ServerPacket,
  ServerPacketType
} from "../../../common/types/packet";

const SERVER_PORT = 9208;

export type CallbackFnFor<T extends ServerPacketType> = (
  arg: PayloadFor<T>
) => boolean; // false to remove callback

export type CallbackFor<T extends ServerPacketType> = {
  type: T;
  callback: CallbackFnFor<T>;
};
export type Callback = CallbackFor<ServerPacketType>;

export class GuestMaster {
  callbacks: Callback[] = [];
  actions: Action[] = [];
  channel: ClientChannel;
  gameId: string = "";
  gameHandler?: (msg: ServerMessage) => void;

  constructor() {
    this.channel = geckos({
      url: process.env.SERVER_URL,
      port: SERVER_PORT
    });
    this.addHandlerCallback();

    this.channel.onConnect((error) => {
      if (error) console.error(error.message);

      this.channel.on("msg", (p: any) => {
        const packet = p as ServerPacket;
        if (packet.payload?.gameId) this.gameId = packet.payload.gameId;

        this.callbacks = this.callbacks.filter(
          (c) => c.type !== packet.type || c.callback(packet.payload)
        );
      });
    });
  }

  public setGameHandler(handler: (msg: ServerMessage) => void) {
    this.gameHandler = handler;
  }

  public addCallback<T extends ServerPacketType>(
    type: T,
    callback: CallbackFnFor<T>
  ) {
    this.callbacks.push({ type, callback });
  }

  public send<T extends ClientPacketType>(
    type: T,
    payload: PayloadFor<T>,
    reliable: boolean = false
  ) {
    const msg = {
      type,
      payload
    };

    this.send_async(msg, reliable);
  }

  private addHandlerCallback() {
    this.addCallback("gameSync", (payload) => {
      this.gameHandler?.(payload.payload);
      return true;
    });
  }

  private async send_async(msg: ClientPacket, reliable: boolean = true) {
    this.channel.emit("msg", msg, { reliable });
  }
}
