import { EnemyGroupState, EnemyRecentEvents } from "../../../common/types/state";
import { Enemy } from "../objects/enemy";
import { EnemyGroupModel } from "../../../common/enemyGroupModel";

export class EnemyGroup extends EnemyGroupModel {
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