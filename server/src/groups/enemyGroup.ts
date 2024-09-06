import { EnemyGroupState, EnemyState } from "../../../common/types/state.js";
import Enemy from "../objects/enemy.js";
import { EnemyGroupModel } from "../../../common/enemyGroupModel.js";

export class EnemyGroup extends EnemyGroupModel {
  public getState(): EnemyGroupState {
    const enemyInfo: EnemyState[] = this.children.entries.map((enemy) => {
      const e = enemy as Enemy;
      return e.getState();
    });
    return {
      enemies: enemyInfo,
      timeUntilNextHorde: this.timeUntilNextHorde,
      spawnPoints: this.spawnPoints
    };
  }
}
