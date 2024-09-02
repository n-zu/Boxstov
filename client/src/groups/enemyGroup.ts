import { EnemyGroupState, EnemyRecentEvents } from "../../../common/types/state";
import { Enemy } from "../objects/enemy";
import { GameEvents } from "../types/events";
import Observer from "../../../common/observer/observer";

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, maxEnemies: number) {
    super(scene.physics.world, scene);

    const enemies: Enemy[] = [];
    for (let i = 0; i < maxEnemies; i++) {
      enemies.push(new Enemy(scene, observer, 0, 0, i));
    }

    this.addMultiple(enemies);
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
