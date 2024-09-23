// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.6.1
// source: messages/playerUpdate.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { MovementMessage } from "./movementMessage.js";
import { PingMessage } from "./pingMessage.js";
import { ShootMessage } from "./shootMessage.js";
import { Stopmessage } from "./stopMessage.js";
import { SwitchGunMessage } from "./switchGunMessage.js";

export const protobufPackage = "messages.v1";

export interface PlayerUpdate {
  playerId: string;
  movement?: MovementMessage | undefined;
  switchGun?: SwitchGunMessage | undefined;
  shoot?: ShootMessage | undefined;
  stop?: Stopmessage | undefined;
  ping?: PingMessage | undefined;
}

function createBasePlayerUpdate(): PlayerUpdate {
  return {
    playerId: "",
    movement: undefined,
    switchGun: undefined,
    shoot: undefined,
    stop: undefined,
    ping: undefined,
  };
}

export const PlayerUpdate: MessageFns<PlayerUpdate> = {
  encode(message: PlayerUpdate, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.playerId !== "") {
      writer.uint32(10).string(message.playerId);
    }
    if (message.movement !== undefined) {
      MovementMessage.encode(message.movement, writer.uint32(18).fork()).join();
    }
    if (message.switchGun !== undefined) {
      SwitchGunMessage.encode(message.switchGun, writer.uint32(26).fork()).join();
    }
    if (message.shoot !== undefined) {
      ShootMessage.encode(message.shoot, writer.uint32(34).fork()).join();
    }
    if (message.stop !== undefined) {
      Stopmessage.encode(message.stop, writer.uint32(42).fork()).join();
    }
    if (message.ping !== undefined) {
      PingMessage.encode(message.ping, writer.uint32(50).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayerUpdate {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayerUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.playerId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.movement = MovementMessage.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.switchGun = SwitchGunMessage.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.shoot = ShootMessage.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.stop = Stopmessage.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.ping = PingMessage.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayerUpdate {
    return {
      playerId: isSet(object.playerId) ? globalThis.String(object.playerId) : "",
      movement: isSet(object.movement) ? MovementMessage.fromJSON(object.movement) : undefined,
      switchGun: isSet(object.switchGun) ? SwitchGunMessage.fromJSON(object.switchGun) : undefined,
      shoot: isSet(object.shoot) ? ShootMessage.fromJSON(object.shoot) : undefined,
      stop: isSet(object.stop) ? Stopmessage.fromJSON(object.stop) : undefined,
      ping: isSet(object.ping) ? PingMessage.fromJSON(object.ping) : undefined,
    };
  },

  toJSON(message: PlayerUpdate): unknown {
    const obj: any = {};
    if (message.playerId !== "") {
      obj.playerId = message.playerId;
    }
    if (message.movement !== undefined) {
      obj.movement = MovementMessage.toJSON(message.movement);
    }
    if (message.switchGun !== undefined) {
      obj.switchGun = SwitchGunMessage.toJSON(message.switchGun);
    }
    if (message.shoot !== undefined) {
      obj.shoot = ShootMessage.toJSON(message.shoot);
    }
    if (message.stop !== undefined) {
      obj.stop = Stopmessage.toJSON(message.stop);
    }
    if (message.ping !== undefined) {
      obj.ping = PingMessage.toJSON(message.ping);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayerUpdate>, I>>(base?: I): PlayerUpdate {
    return PlayerUpdate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayerUpdate>, I>>(object: I): PlayerUpdate {
    const message = createBasePlayerUpdate();
    message.playerId = object.playerId ?? "";
    message.movement = (object.movement !== undefined && object.movement !== null)
      ? MovementMessage.fromPartial(object.movement)
      : undefined;
    message.switchGun = (object.switchGun !== undefined && object.switchGun !== null)
      ? SwitchGunMessage.fromPartial(object.switchGun)
      : undefined;
    message.shoot = (object.shoot !== undefined && object.shoot !== null)
      ? ShootMessage.fromPartial(object.shoot)
      : undefined;
    message.stop = (object.stop !== undefined && object.stop !== null)
      ? Stopmessage.fromPartial(object.stop)
      : undefined;
    message.ping = (object.ping !== undefined && object.ping !== null)
      ? PingMessage.fromPartial(object.ping)
      : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}