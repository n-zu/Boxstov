import { GameMaster } from "./gameMaster.js";
import {ServerChannel} from "@geckos.io/server";
import http from "http";

export type BaseMessage = { [id: number | string]: any };

export type Message = {
  type: string;
  payload: Message | BaseMessage;
} | BaseMessage;

export class HostMaster extends GameMaster {
  constructor(server: http.Server) {
    super(server);
  }

  public broadcast(type: string, payload: Message) {
    const msg = {
      type,
      payload
    } as Message;


    this.channels.forEach((channel) => {
      this.send_async(channel, msg);
    });
  }

  private async send_async(channel: ServerChannel, msg: Message) {
    channel.emit("msg", msg);
  }
}
