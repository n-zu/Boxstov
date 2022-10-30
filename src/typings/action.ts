import { WorldState } from "../scripts/objects/world";
import { Direction } from "./direction";

export interface PlayerUpdate {
  id: string;
  payload: PlayerUpdatePayload;
}

export type PlayerUpdatePayload = PlayerUpdateMove | PlayerUpdateOther;

export interface PlayerUpdateMove {
  type: "move";
  direction: Direction;
}

export interface PlayerUpdateOther {
  type: "stop" | "shoot";
}

export type SyncUpdate = WorldState;

export type Update = PlayerUpdate | SyncUpdate;
export type MessageType = "player" | "sync";
export type UpdateFor<T extends MessageType> = T extends "player"
  ? PlayerUpdate
  : T extends "sync"
  ? SyncUpdate
  : never;

export interface ActionI<T extends MessageType = MessageType> {
  type: T;
  action: (arg: UpdateFor<T>) => void;
}
export interface MessageI<T extends MessageType = MessageType> {
  type: T;
  payload: UpdateFor<T>;
}

export type Action = ActionI<MessageType>;
export type Message = MessageI<MessageType>;
