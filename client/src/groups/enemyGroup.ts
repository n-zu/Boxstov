import { EnemyGroupState } from "../../../common/types/state";
import { Enemy } from "../objects/enemy";
import { Difficulty, EnemyGroupModel } from "../../../common/enemyGroupModel";
import Observer from "../../../common/observer/observer";
import { GameEvents } from "../../../common/types/events";
import EnemyPhysique from "../objects/enemyPhysique";
import { EnemyGroup as EnemyGroupProto } from "../../../common/generated/groups/enemyGroup.js";
import { Buffer } from "buffer";

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


  public sync(enemyGroupProto: EnemyGroupState) {
    const enemyGroupState = EnemyGroupProto.decode(Buffer.from(enemyGroupProto, "base64"));

    enemyGroupState.enemies.forEach((enemyState, i) => {
      const enemy = this.children.entries[i] as Enemy;
      enemy.sync(enemyState);
    });
  }
}