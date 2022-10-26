import Peer from "peerjs";
import { Message } from "./hostMaster";


export type Action = {
  type: string;
  action: (any?) => void;
};

export abstract class GameMaster {
  actions: Action[] = [];
  peer: Peer;

  protected constructor(peerId?: string) {
    this.peer = this.createPeer(peerId);
  }

  public addAction(type: string, action: (any) => void) {
    this.actions.push({ type, action });
  }

  public abstract send(type: string, message: Message): void;

  createPeer(socketId?: string): Peer {
    if (socketId) {
      return new Peer(socketId);
    } else {
      return new Peer();
    }
  }
}
