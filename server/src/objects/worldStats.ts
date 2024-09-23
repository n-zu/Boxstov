import WorldStatsModel from "../../../common/worldStatsModel.js";
import { WorldStats as WorldStatsProto } from "../../../common/generated/world/worldStats.js";

export default class WorldStats extends WorldStatsModel {
  public getState(): WorldStatsProto {
    return {
      kills: this.kills,
      killsPerPlayer: this.killsPerPlayer,
      rage: this.rage
    };
  }
}