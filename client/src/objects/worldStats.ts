import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events";
import { WorldStatsState } from "../../../common/types/state.js";

export default class WorldStats {
  kills: number;
  killsPerPlayer: { [playerId: string]: number };
  rage: number;
  observer: Observer<GameEvents>;

  constructor(observer: Observer<GameEvents>) {
    this.kills = 0;
    this.killsPerPlayer = {};
    this.rage = 0;
    this.observer = observer;
  }

  public sync(state: WorldStatsState) {
    this.kills = state.kills;
    this.killsPerPlayer = state.killsPerPlayer;
    this.rage = state.rage;
  }
}