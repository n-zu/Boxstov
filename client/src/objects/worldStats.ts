import { WorldStatsState } from "../../../common/types/state.js";
import WorldStatsModel from "../../../common/worldStatsModel.js";
import { WorldStats as WorldStatsProto } from "../../../common/generated/world/worldStats.js";
import { Buffer } from "buffer";

export default class WorldStats extends WorldStatsModel {
  public sync(stateStr: WorldStatsState) {
    const state = WorldStatsProto.decode(Buffer.from(stateStr, "base64"));
    
    this.kills = state.kills;
    this.killsPerPlayer = state.killsPerPlayer;
    this.rage = state.rage;
  }
}