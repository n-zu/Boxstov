import { WorldStatsState } from "../../../common/types/state.js";
import WorldStatsModel from "../../../common/worldStatsModel.js";
import { WorldStats as WorldStatsProto } from "../../../common/generated/world/worldStats.js";
import { Buffer } from "buffer";

export default class WorldStats extends WorldStatsModel {
  public getState(): WorldStatsState {
    return {
      kills: this.kills,
      killsPerPlayer: this.killsPerPlayer,
      rage: this.rage
    };
  }
}