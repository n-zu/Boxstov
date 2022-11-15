import {
  UpdateFor,
  ActionFnFor,
  ClientMessageType,
  ServerMessageType,
} from "../../../common/types/messages.js";

export interface GameMaster {
  addAction<T extends ClientMessageType>(type: T, action: ActionFnFor<T>): void;

  broadcast<T extends ServerMessageType>(type: T, payload: UpdateFor<T>): void;
}
