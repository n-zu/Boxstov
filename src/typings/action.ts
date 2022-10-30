import { WorldState } from "../scripts/objects/world";

export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  UpLeft = "upLeft",
  UpRight = "upRight",
  DownLeft = "downLeft",
  DownRight = "downRight",
}

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

export interface EnemyUpdate {
  id: number;
  type: "die";
}

export type Update = PlayerUpdate | SyncUpdate | EnemyUpdate;
export type MessageType = "player" | "sync" | "enemy";
export type UpdateFor<T extends MessageType> = T extends "player"
  ? PlayerUpdate
  : T extends "sync"
  ? SyncUpdate
  : T extends "enemy"
  ? EnemyUpdate
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
