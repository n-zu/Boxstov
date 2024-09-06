import { EnemyGroupState, EnemyRecentEvents } from "../../../common/types/state";
import { Enemy } from "../objects/enemy";
import { Difficulty, EnemyGroupModel } from "../../../common/enemyGroupModel";
import Observer from "../../../common/observer/observer";
import { GameEvents } from "../types/events";

export class EnemyGroup extends EnemyGroupModel {
  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, difficulty: Difficulty, spawnPoints: { x: number; y: number }[]) {
    super(
      scene,
      observer,
      difficulty,
      spawnPoints,
      (id, scene, position, observer, physique) => new Enemy(id, scene, position, observer, physique));
  }
  
  public sync(enemyGroupState: EnemyGroupState, enemyRecentEvents: { [enemyId: number]: EnemyRecentEvents[]}) {
    enemyGroupState.enemies.forEach((enemyState, i) => {
      const enemy = this.children.entries[i] as Enemy;
      enemy.sync(enemyState, this.getRecentEventsOf(i, enemyRecentEvents));
    });
  }

  private getRecentEventsOf(id: number, enemyRecentEvents: { [enemyId: number]: EnemyRecentEvents[] }) {
    const recentEvents = enemyRecentEvents[id];
    if (recentEvents === undefined) {
      return [];
    }
    return recentEvents;
  }
}