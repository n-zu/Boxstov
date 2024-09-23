// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.6.1
// source: enemy/enemy.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Position } from "../utils/position.js";
import { EnemyPhysique } from "./enemyPhysique.js";

export const protobufPackage = "enemy.v1";

export interface Enemy {
  position: Position | undefined;
  physique: EnemyPhysique | undefined;
  dead: boolean;
  action: string;
  spawned: boolean;
  angle: number;
}

function createBaseEnemy(): Enemy {
  return { position: undefined, physique: undefined, dead: false, action: "", spawned: false, angle: 0 };
}

export const Enemy: MessageFns<Enemy> = {
  encode(message: Enemy, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.position !== undefined) {
      Position.encode(message.position, writer.uint32(10).fork()).join();
    }
    if (message.physique !== undefined) {
      EnemyPhysique.encode(message.physique, writer.uint32(18).fork()).join();
    }
    if (message.dead !== false) {
      writer.uint32(24).bool(message.dead);
    }
    if (message.action !== "") {
      writer.uint32(34).string(message.action);
    }
    if (message.spawned !== false) {
      writer.uint32(40).bool(message.spawned);
    }
    if (message.angle !== 0) {
      writer.uint32(53).float(message.angle);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Enemy {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnemy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.position = Position.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.physique = EnemyPhysique.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.dead = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.action = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.spawned = reader.bool();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }

          message.angle = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Enemy {
    return {
      position: isSet(object.position) ? Position.fromJSON(object.position) : undefined,
      physique: isSet(object.physique) ? EnemyPhysique.fromJSON(object.physique) : undefined,
      dead: isSet(object.dead) ? globalThis.Boolean(object.dead) : false,
      action: isSet(object.action) ? globalThis.String(object.action) : "",
      spawned: isSet(object.spawned) ? globalThis.Boolean(object.spawned) : false,
      angle: isSet(object.angle) ? globalThis.Number(object.angle) : 0,
    };
  },

  toJSON(message: Enemy): unknown {
    const obj: any = {};
    if (message.position !== undefined) {
      obj.position = Position.toJSON(message.position);
    }
    if (message.physique !== undefined) {
      obj.physique = EnemyPhysique.toJSON(message.physique);
    }
    if (message.dead !== false) {
      obj.dead = message.dead;
    }
    if (message.action !== "") {
      obj.action = message.action;
    }
    if (message.spawned !== false) {
      obj.spawned = message.spawned;
    }
    if (message.angle !== 0) {
      obj.angle = message.angle;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Enemy>, I>>(base?: I): Enemy {
    return Enemy.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Enemy>, I>>(object: I): Enemy {
    const message = createBaseEnemy();
    message.position = (object.position !== undefined && object.position !== null)
      ? Position.fromPartial(object.position)
      : undefined;
    message.physique = (object.physique !== undefined && object.physique !== null)
      ? EnemyPhysique.fromPartial(object.physique)
      : undefined;
    message.dead = object.dead ?? false;
    message.action = object.action ?? "";
    message.spawned = object.spawned ?? false;
    message.angle = object.angle ?? 0;
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