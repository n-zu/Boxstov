import geckos, {ClientChannel} from "@geckos.io/client";

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
  channel: ClientChannel;

  protected constructor() {
    this.channel = geckos({port: 5000});
    this.channel.onConnect(error => {
      if (error) console.error(error.message)

      this.channel?.on('ready', () => {
        console.log('ready')
      })
      this.channel.on('msg', (msg: any) => {
        console.log("Received message:", msg)
        const message = msg as Message;
        this.actions.find((action) => action.type === message.type)?.action(
          message.payload
        );
      });
    })

  }

  public addAction(type: string, action: (arg?: any) => void) {
    this.actions.push({ type, action });
  }

  public abstract send(type: string, message: Message): void;

  public abstract shouldSendSync(): boolean;

  public abstract broadcast(type: string, message: Message): void;
}
