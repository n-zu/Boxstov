import { WorldStatsState } from "../../../common/types/state.js";
import WorldStatsModel from "../../../common/worldStatsModel.js";

export default class WorldStats extends WorldStatsModel {
  public sync(state: WorldStatsState) {
    this.kills = state.kills;
    this.killsPerPlayer = state.killsPerPlayer;
    this.rage = state.rage;
  }
}