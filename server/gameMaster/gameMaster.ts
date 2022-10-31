import geckos, {iceServers, ServerChannel} from "@geckos.io/server";
import http from "http";

export type BaseMessage = { [id: number | string]: any };

export type Message = {
  type: string;
  payload: Message | BaseMessage;
} | BaseMessage;

export type Action = {
  type: string;
  action: (arg?: any) => void;
};

export abstract class GameMaster {
  actions: Action[] = [];
  io: any;
  channels: ServerChannel[] = [];

  protected constructor(server: http.Server) {
    this.io = geckos({
      iceServers: iceServers
    })
    this.io.addServer(server)

    this.io.onConnection((channel: ServerChannel) => {
      console.log('new connection')
      this.channels.push(channel)

      // @ts-ignore
      channel.on('msg', (msg: any) => {
        console.log("Received message:", msg)
        const message = msg as Message;
        this.actions.find((action) => action.type === message.type)?.action(
          message.payload
        );
      });
    });
  }

  public addAction(type: string, action: (arg?: any) => void) {
    this.actions.push({ type, action });
  }

  public abstract broadcast(type: string, message: Message): void;
}
