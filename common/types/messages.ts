import { EncodedMovementDirection } from "../controls/direction.js";
import { UnitVector } from "./direction.js";
import { WorldState } from "./state.js";

// Messages

export type ServerMessageType = "sync";
export type ClientMessageType = "player" | "enemy";
export type MessageType = ServerMessageType | ClientMessageType;

export type Message<T extends MessageType> = {
  type: T;
  payload: UpdateFor<T>;
};
export type ClientMessage = Message<ClientMessageType>;
export type ServerMessage = Message<ServerMessageType>;

// Updates

export type UpdateFor<T extends MessageType> = T extends "sync"
  ? SyncUpdate
  : T extends "player"
  ? PlayerUpdate
  : T extends "enemy"
  ? EnemyUpdate
  : undefined;

// Player

export type PlayerUpdateType = "move" | "shoot" | "ping";

export type PlayerUpdateBase<T extends PlayerUpdateType> = {
  id: string;
  type: T;
};

export type PlayerUpdateMove = {
  direction: EncodedMovementDirection;
} & PlayerUpdateBase<"move">;

export type PlayerUpdateFor<T extends PlayerUpdateType> = T extends "move"
  ? PlayerUpdateMove
  : PlayerUpdateBase<T>;

export type PlayerUpdate = PlayerUpdateFor<PlayerUpdateType>;

// Enemy

export type EnemyUpdate = {
  type: "die";
  id: number;
};

// Sync

export type SyncUpdate = WorldState;

// Actions

export type ActionFnFor<T extends MessageType> = (arg: UpdateFor<T>) => void;
export type ActionI<T extends MessageType> = {
  type: T;
  action: ActionFnFor<T>;
};
export type Action = ActionI<MessageType>;
