import { Message } from "./messages";

export type ClientPacketType = "gameInfo" | "createGame" | "joinGame";
export type ServerPacketType = "gameInfo" | "invalidId" | "nameTaken";
export type PacketType = ClientPacketType | ServerPacketType;

export type Create = {
  username: string;
};

export type GameInfo = {
  payload: Message;
} & GameId;

export type Join = {
  username: string;
} & GameId;

export type GameId = {
  gameId: string;
};

export type PayloadFor<T extends PacketType> = T extends "gameInfo"
  ? GameInfo
  : T extends "joinGame"
  ? Join
  : T extends "createGame"
  ? Create
  : undefined;

export type Packet<T extends PacketType> = {
  type: T;
  payload: PayloadFor<T>;
};
export type ClientPacket = Packet<ClientPacketType>;
export type ServerPacket = Packet<ServerPacketType>;

/*
export type CallbackFnFor<T extends PacketType> = (arg: PayloadFor<T>) => void;
export type CallbackFor<T extends PacketType> = {
  type: T;
  callback: CallbackFnFor<T>;
};
export type ClientCallback = CallbackFor<ServerPacketType>;
*/