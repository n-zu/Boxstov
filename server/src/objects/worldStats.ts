import { WorldStatsState } from "../../../common/types/state.js";
import WorldStatsModel from "../../../common/worldStatsModel.js";
import { WorldStats as WorldStatsProto } from "../../../common/generated/world/worldStats.js";
import { Buffer } from "buffer";

export default class WorldStats extends WorldStatsModel {
  public getState(): WorldStatsState {
    const state = {
      kills: this.kills,
      killsPerPlayer: this.killsPerPlayer,
      rage: this.rage
    };

    const bytes = WorldStatsProto.encode(state).finish();
    return Buffer.from(bytes).toString("base64");
  }
}