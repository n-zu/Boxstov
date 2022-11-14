import { GameMaster } from "./gameMaster.js";
import { ServerChannel } from "@geckos.io/server";
import {
  Message,
  UpdateType,
  UpdateFor,
  ActionFnFor,
  Action,
} from "../../../common/types/messages.js";
import { HostMaster } from "./hostMaster.js";
import { Packet } from "../../../common/types/packet.js";

export class SessionMaster implements GameMaster {
  id: string;
  actions: Action[] = [];
  channels: ServerChannel[] = [];
  hostMaster: HostMaster;

  constructor(id: string, hostMaster: HostMaster) {
    this.id = id;
    this.hostMaster = hostMaster;

    hostMaster.setGameHandler(id, (msg) => {
      this.actions
        .find((action) => action.type === msg.type)
        ?.action(msg.payload);
    });
  }

  public stop() {
    this.hostMaster.clearGameHandlers(this.id);
  }

  public addAction<T extends UpdateType>(
    type: T,
    action: ActionFnFor<T>
  ): void {
    this.actions.push({ type, action });
  }

  public addMember(channel: ServerChannel) {
    this.channels.push(channel);
  }

  public broadcast<T extends UpdateType>(type: T, payload: UpdateFor<T>) {
    const msg = {
      type,
      payload,
    };

    this.channels.forEach((channel) => {
      this.send_async(channel, {
        type: "gameInfo",
        payload: {
          gameId: this.id,
          payload: msg,
        },
      });
    });
  }

  private async send_async(channel: ServerChannel, packet: Packet<"gameInfo">) {
    channel.emit("msg", packet);
  }
}
