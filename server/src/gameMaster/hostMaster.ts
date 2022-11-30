import geckos, {
  GeckosServer,
  iceServers,
  ServerChannel,
} from "@geckos.io/server";
import http from "http";
import { ClientMessage, Message } from "../../../common/types/messages.js";
import {
  ClientPacket,
  ClientPacketType,
  PayloadFor,
  ServerPacketType,
} from "../../../common/types/packet.js";

export type CallbackFnFor<T extends ClientPacketType> = (
  channel: ServerChannel,
  arg: PayloadFor<T>
) => void;

export type CallbackFor<T extends ClientPacketType> = {
  type: T;
  callback: CallbackFnFor<T>;
};
export type Callback = CallbackFor<ClientPacketType>;

export class HostMaster {
  callbacks: Callback[] = [];
  io: GeckosServer;
  lobbyChannels: ServerChannel[] = [];
  gameHandlers: { [key: string]: (msg: ClientMessage) => void } = {};

  constructor(server: http.Server) {
    this.io = geckos({
      iceServers: iceServers,
    });
    this.io.addServer(server);
    this.addHandlersCallback();

    this.io.onConnection((channel: ServerChannel) => {
      console.log("new connection");
      this.lobbyChannels.push(channel);

      channel.on("msg", (p: any) => {
        const packet = p as ClientPacket;

        this.callbacks
          .find((c) => c.type === packet.type)
          ?.callback(channel, packet.payload);
      });
    });
  }

  private addHandlersCallback() {
    this.addCallback("gameInfo", (_, payload) => {
      this.gameHandlers?.[payload.gameId]?.(payload.payload);
    });
  }

  public setGameHandler(gameId: string, handler: (msg: ClientMessage) => void) {
    this.gameHandlers[gameId] = handler;
  }

  public clearGameHandlers(gameId: string) {
    delete this.gameHandlers[gameId];
  }

  public addCallback<T extends ClientPacketType>(
    type: T,
    callback: CallbackFnFor<T>
  ) {
    this.callbacks.push({ type, callback });
  }

  public send<T extends ServerPacketType>(
    channel: ServerChannel,
    type: T,
    payload: PayloadFor<T>,
    reliable: boolean = false
  ) {
    channel.emit(
      "msg",
      {
        type,
        payload,
      },
      { reliable }
    );
  }
}
