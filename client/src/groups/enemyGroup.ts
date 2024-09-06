import { EnemyGroupState, EnemyRecentEvents } from "../../../common/types/state";
import { Enemy } from "../objects/enemy";
import { GameEvents } from "../types/events";
import Observer from "../../../common/observer/observer";
import EnemyPhysique from "../../../common/enemy/enemyPhysique";

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, maxEnemies: number) {
    super(scene.physics.world, scene);

    const enemies: Enemy[] = [];
    for (let i = 0; i < maxEnemies; i++) {
      // TODO: Fix the enemy physique
      enemies.push(new Enemy(i, scene, {x: 0, y: 0}, observer, new EnemyPhysique(1, 1, 1, 1)));
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
