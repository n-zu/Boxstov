import { Enemy } from "../objects/enemy.js";
import { Player } from "../objects/player.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import {
  EnemyGroupState,
  EnemyState,
  SpawnPoint,
} from "../../../common/types/state.js";

const TIME_BETWEEN_HORDES = 1000;

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  difficulty: Difficulty;
  timeUntilNextHorde = 0;
  spawnPoints: SpawnPoint[];

  constructor(
    scene: Phaser.Scene,
    maxEnemies: number,
    difficulty: Difficulty,
    spawnPoints: SpawnPoint[],
    gameMaster: GameMaster
  ) {
    super(scene.physics.world, scene);

    const enemies: Enemy[] = [];
    for (let i = 0; i < maxEnemies; i++) {
      enemies.push(new Enemy(scene, 0, 0, gameMaster, i));
    }

    this.addMultiple(enemies);

    this.difficulty = difficulty;
    this.spawnPoints = spawnPoints;
  }

  public update(players: Player[]) {
    const enemies = this.getMatching("active", true) as Enemy[];
    enemies.forEach((e) => {
      e.update(players);
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
      spawnPoints: this.spawnPoints,
    };
  }

  public handleMessage(message: any) {
    const enemy = this.children.entries[message.id] as Enemy;
    enemy.handleMessage(message);
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
        const spawnPoint =
          this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        const xPosition = spawnPoint.x + Math.floor(Math.random() * 100) - 50;
        const yPosition = spawnPoint.y + Math.floor(Math.random() * 100) - 50;

        enemy.spawn(xPosition, yPosition);
      } else {
        break;
      }
    }
  }
}
