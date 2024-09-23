import WorldStatsModel from "../../../common/worldStatsModel.js";
import { WorldStats as WorldStatsProto } from "../../../common/generated/world/worldStats.js";

export default class WorldStats extends WorldStatsModel {
  public sync(state: WorldStatsProto) {
    this.kills = state.kills;
    this.killsPerPlayer = state.killsPerPlayer;
    this.rage = state.rage;
  }
}