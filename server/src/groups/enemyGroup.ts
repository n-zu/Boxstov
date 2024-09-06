import { EnemyGroupState, EnemyState } from "../../../common/types/state.js";
import Enemy from "../objects/enemy.js";
import { Difficulty, EnemyGroupModel } from "../../../common/enemyGroupModel.js";
import Observer from "../../../common/observer/observer.js";
import { GameEvents } from "../../../common/types/events.js";
import EnemyPhysique from "../objects/enemyPhysique.js";

export class EnemyGroup extends EnemyGroupModel {
  constructor(scene: Phaser.Scene, observer: Observer<GameEvents>, difficulty: Difficulty, spawnPoints: { x: number; y: number }[]) {
    super(
      scene,
      observer,
      difficulty,
      spawnPoints,
      (id, scene, position, observer, physique) => new Enemy(id, scene, position, observer, physique));
  }

  protected newNormalEnemyPhysique(health: number, strength: number, speed: number, attackRange: number) {
    return new EnemyPhysique(health, strength, speed, attackRange);
  }

  protected newFastEnemyPhysique(health: number, strength: number, speed: number, attackRange: number) {
    return new EnemyPhysique(health, strength, speed, attackRange);
  }
  
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
