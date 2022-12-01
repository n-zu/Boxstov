import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../types/events.js";
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

    this.observer.subscribe("enemyKilled", (playerId) => this.addKill(playerId));
  }

  public update() {
    this.rage = Math.max(0, this.rage - 0.002);
  }

  public addKill(playerId: string) {
    this.kills++;
    this.killsPerPlayer[playerId] = this.killsPerPlayer[playerId] + 1 || 1;
    this.rage = Math.ceil(this.rage) + 1;
  }

  public getState(): WorldStatsState {
    return {
      kills: this.kills,
      killsPerPlayer: this.killsPerPlayer,
      rage: this.rage
    };
  }
}