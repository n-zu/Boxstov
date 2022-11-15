import {
  UpdateFor,
  ActionFnFor,
  ServerMessageType,
  ClientMessageType,
} from "../../../common/types/messages.js";

export interface GameMaster {
  addAction<T extends ServerMessageType>(type: T, action: ActionFnFor<T>): void;

  send<T extends ClientMessageType>(type: T, payload: UpdateFor<T>): void;

  getGameId(): string;
}
