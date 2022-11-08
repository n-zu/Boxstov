import { UnitVector } from "./direction.js";
import { WorldState } from "./state.js";

// Player

export type PlayerUpdate = {
  id: string;
  payload: PlayerUpdatePayload;
};

export type PlayerUpdatePayload = PlayerUpdateMove | PlayerUpdateOther;

export type PlayerUpdateMove = {
  type: "move";
  direction: UnitVector;
};

export type PlayerUpdateOther = {
  type: "stop" | "shoot" | "ping";
};

// Enemy

export type EnemyUpdate = {
  type: "die";
  id: number;
};

// Sync

export type SyncUpdate = WorldState;

// Updates

export type UpdateType = "player" | "sync" | "enemy";
export type Update = PlayerUpdate | SyncUpdate | EnemyUpdate;
export type UpdateFor<T extends UpdateType> = T extends "player"
  ? PlayerUpdate
  : T extends "sync"
  ? SyncUpdate
  : T extends "enemy"
  ? EnemyUpdate
  : never;

// Actions

export type ActionFnFor<T extends UpdateType> = (arg: UpdateFor<T>) => void;
export type ActionI<T extends UpdateType> = {
  type: T;
  action: ActionFnFor<T>;
};
export type Action = ActionI<UpdateType>;

// Messages

export type MessageI<T extends UpdateType> = {
  type: T;
  payload: UpdateFor<T>;
};
export type Message = MessageI<UpdateType>;
