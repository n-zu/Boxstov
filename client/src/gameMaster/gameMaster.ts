import {
  UpdateType,
  UpdateFor,
  ActionFnFor,
} from "../../../common/types/messages.js";

export interface GameMaster {
  addAction<T extends UpdateType>(type: T, action: ActionFnFor<T>): void;

  send<T extends UpdateType>(type: T, payload: UpdateFor<T>): void;

  getGameId(): string;
}
