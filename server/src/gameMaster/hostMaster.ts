import { GameMaster } from "./gameMaster.js";
import { ServerChannel } from "@geckos.io/server";
import http from "http";
import {
  Message,
  UpdateType,
  UpdateFor,
} from "../../../common/types/messages.js";

export class HostMaster extends GameMaster {
  constructor(server: http.Server) {
    super(server);
  }

  public broadcast<T extends UpdateType>(type: T, payload: UpdateFor<T>) {
    const msg = {
      type,
      payload,
    };

    this.channels.forEach((channel) => {
      this.send_async(channel, msg);
    });
  }

  private async send_async(channel: ServerChannel, msg: Message) {
    channel.emit("msg", msg);
  }
}
