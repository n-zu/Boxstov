import { ClientMessage, ServerMessage } from "./messages";

export type ClientPacketType = "gameInfo" | "createGame" | "joinGame";
export type ServerPacketType = "gameSync" | "invalidId" | "nameTaken";
export type PacketType = ClientPacketType | ServerPacketType;

export type GameId = {
  gameId: string;
};

export type GameSync = {
  payload: ServerMessage;
} & GameId;

export type GameInfo = {
  payload: ClientMessage;
} & GameId;

export type Create = {
  username: string;
};

export type Join = {
  username: string;
} & GameId;

export type PayloadFor<T extends PacketType> = T extends "gameInfo"
  ? GameInfo
  : T extends "joinGame"
  ? Join
  : T extends "createGame"
  ? Create
  : T extends "gameSync"
  ? GameSync
  : undefined;

export type Packet<T extends PacketType> = {
  type: T;
  payload: PayloadFor<T>;
};
export type ClientPacket = Packet<ClientPacketType>;
export type ServerPacket = Packet<ServerPacketType>;
