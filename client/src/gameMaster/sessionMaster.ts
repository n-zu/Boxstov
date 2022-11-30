import {
  Action,
  ActionFnFor,
  ClientMessage,
  ClientMessageType,
  ServerMessageType,
  UpdateFor,
} from "../../../common/types/messages";
import { GameMaster } from "./gameMaster";
import { GuestMaster } from "./guestMaster";

const SERVER_PORT = 9208;

export class SessionMaster implements GameMaster {
  actions: Action[] = [];
  guestMaster: GuestMaster;

  constructor(guestMaster: GuestMaster) {
    this.guestMaster = guestMaster;
    guestMaster.setGameHandler((msg) => {
      this.actions
        .find((action) => action.type === msg.type)
        ?.action(msg.payload);
    });
  }

  public addAction<T extends ServerMessageType>(
    type: T,
    action: ActionFnFor<T>
  ) {
    this.actions.push({ type, action });
  }

  public send<T extends ClientMessageType>(type: T, payload: UpdateFor<T>) {
    const msg = {
      type,
      payload,
    };

    this.send_async(msg);
  }

  private async send_async(msg: ClientMessage) {
    this.guestMaster.send("gameInfo", {
      gameId: this.guestMaster.gameId,
      payload: msg,
    });
  }

  public getGameId() {
    return this.guestMaster.gameId;
  }
}
