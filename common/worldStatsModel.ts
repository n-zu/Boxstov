import Observer from "./observer/observer";
import { GameEvents } from "./types/events";
import { WorldStatsState } from "./types/state";

export default class WorldStatsModel {
  kills: number;
  killsPerPlayer: { [playerId: string]: number };
  rage: number;
  observer: Observer<GameEvents>;

  constructor(observer: Observer<GameEvents>) {
    this.kills = 0;
    this.killsPerPlayer = {};
    this.rage = 0;
    this.observer = observer;

    this.observer.subscribe("playerKill", (killer) => this.addKill(killer.id));
  }

  public update() {
    this.rage = Math.max(0, this.rage - 0.002);
  }

  public addKill(playerId: string) {
    this.kills++;
    this.killsPerPlayer[playerId] = this.killsPerPlayer[playerId] + 1 || 1;
    this.rage = Math.ceil(this.rage) + 1;
  }
}