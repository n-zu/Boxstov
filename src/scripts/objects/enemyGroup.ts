import { Enemy, EnemyState } from "./enemy";
import { Player } from "./player";

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
  difficulty: Difficulty;
  timeUntilNextHorde = 0;
  spawnPoints: SpawnPoint[];

  constructor(scene: Phaser.Scene, maxEnemies: number, difficulty: Difficulty, spawnPoints: SpawnPoint[]) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: maxEnemies,
      key: "enemy",
      active: false,
      visible: false,
      classType: Enemy
    });
    this.difficulty = difficulty;
    this.spawnPoints = spawnPoints;
  }

  public update(players: Player[]) {
    const enemies = this.getMatching("active", true) as Enemy[];
    enemies.forEach((e) => {
      const enemy = e as Enemy;
      enemy.update(players);
    });
    this.timeUntilNextHorde -= 1;
    if (this.timeUntilNextHorde <= 0) {
      this.spawnHorde();
      this.timeUntilNextHorde = TIME_BETWEEN_HORDES;
    }
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

  public sync(enemyGroupState: EnemyGroupState) {
    this.timeUntilNextHorde = enemyGroupState.timeUntilNextHorde;
    this.spawnPoints = enemyGroupState.spawnPoints;
    enemyGroupState.enemies.forEach((enemyState, i) => {
      const enemy = this.children.entries[i] as Enemy;
      enemy.sync(enemyState);
    });
  }

  private getEnemiesToSpawn() {
    const deadEnemies = this.getMatching("active", false).length;
    switch (this.difficulty) {
      case Difficulty.Easy:
        return deadEnemies * 0.25;
      case Difficulty.Medium:
        return deadEnemies * 0.5;
      case Difficulty.Hard:
        return deadEnemies * 0.75;
    }
  }

  private spawnHorde() {
    const enemiesToSpawn = this.getEnemiesToSpawn();
    for (let i = 0; i < enemiesToSpawn; i++) {
      const enemy = this.getFirstDead(false) as Enemy;
      if (enemy) {
        const spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        const xPosition = spawnPoint.x + Math.floor(Math.random() * 100) - 50;
        const yPosition = spawnPoint.y + Math.floor(Math.random() * 100) - 50;

        enemy.spawn(xPosition, yPosition);
      } else {
        break;
      }
    }
  }
}
