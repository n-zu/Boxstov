import Peer from "peerjs";
import { Action, MessageType, Update, UpdateFor } from "../../typings/action";

export abstract class GameMaster {
  actions: Action[] = [];
  peer: Peer;

  protected constructor(peerId?: string) {
    this.peer = this.createPeer(peerId);
  }

  public abstract send(type: string, message: Update): void;

  protected createPeer(socketId?: string): Peer {
    if (socketId) {
      return new Peer(socketId);
    } else {
      return new Peer();
    }
  }

  public addAction<T extends MessageType>(
    type: T,
    action: (arg: UpdateFor<T>) => void
  ) {
    this.actions.push({ type, action } as Action);
  }

  public abstract shouldSendSync(): boolean;

  public abstract broadcast(type: string, message: Update): void;
}
