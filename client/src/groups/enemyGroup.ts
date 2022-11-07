import { EnemyGroupState } from "../../../common/types/state";
import { Enemy } from "../objects/enemy";

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, maxEnemies: number) {
    super(scene.physics.world, scene);

    const enemies: Enemy[] = [];
    for (let i = 0; i < maxEnemies; i++) {
      enemies.push(new Enemy(scene, 0, 0, i));
    }

    this.addMultiple(enemies);
  }

  public sync(enemyGroupState: EnemyGroupState) {
    enemyGroupState.enemies.forEach((enemyState, i) => {
      const enemy = this.children.entries[i] as Enemy;
      enemy.sync(enemyState);
    });
  }

  public handleMessage(message: any) {
    const enemy = this.children.entries[message.id] as Enemy;
    enemy.handleMessage(message);
  }
}
