import { Enemy } from "../objects/enemy";
import { EnemyGroupState } from "../../typings/state";

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, maxEnemies: number) {
    super(scene.physics.world, scene);

    const enemies: Enemy[] = [];
    for (let i = 0; i < maxEnemies; i++) {
      enemies.push(new Enemy(scene, 0, 0, i));
    }

    this.addMultiple(enemies);
  }

  public update() {
    this.children.entries.forEach((e) => {
      const enemy = e as Enemy;
      enemy.update();
    });
  }

  public sync(nextState?: EnemyGroupState) {
    if (!nextState) return;

    nextState.enemies.forEach((enemyState, i) => {
      const enemy = this.children.entries[i] as Enemy;
      enemy.sync(enemyState);
    });
  }

  public getState(): EnemyGroupState {
    return {
      enemies: this.children.entries.map((e) => (e as Enemy).getState()),
    };
  }
}
