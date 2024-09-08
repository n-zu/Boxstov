import { WorldStatsState } from "../../../common/types/state.js";
import WorldStatsModel from "../../../common/worldStatsModel.js";

export default class WorldStats extends WorldStatsModel {
  public getState(): WorldStatsState {
    return {
      kills: this.kills,
      killsPerPlayer: this.killsPerPlayer,
      rage: this.rage
    };
  }
}