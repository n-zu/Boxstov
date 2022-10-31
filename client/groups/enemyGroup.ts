import { Enemy, EnemyState } from "../objects/enemy";
import { Player } from "../objects/player";
import { GameMaster } from "../gameMaster/gameMaster";

const TIME_BETWEEN_HORDES = 1000;

export type EnemyGroupState = {
  enemies: EnemyState[];
  timeUntilNextHorde: number;
  spawnPoints: SpawnPoint[];
}

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export type SpawnPoint = {
  x: number;
  y: number;
}

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, maxEnemies: number) {
    console.log("constructing enemy group");
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
