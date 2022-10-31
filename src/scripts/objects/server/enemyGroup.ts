import { EnemyGroupState } from "../../../typings/state";
import { EnemyGroup } from "../../groups/enemyGroup";
import { Enemy } from "../enemy";
import { Player } from "../player";
import EnemyServer from "./enemy";

export type SpawnPoint = {
  x: number;
  y: number;
};

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

const TIME_BETWEEN_HORDES = 10000;

export default class EnemyGroupServer {
  enemyGroup: EnemyGroup;
  enemyServers: EnemyServer[];
  difficulty: Difficulty;
  spawnPoints: SpawnPoint[];
  lastSpawn: number;

  constructor(enemyGroup: EnemyGroup) {
    this.enemyGroup = enemyGroup;
    this.difficulty = Difficulty.Easy;
    this.enemyServers = [];
    enemyGroup.children.entries.forEach((enemy) => {
      this.enemyServers.push(new EnemyServer(enemy as Enemy));
    });
    this.lastSpawn = 0;

    this.spawnPoints = [
      { x: 100, y: 100 },
      { x: 100, y: 900 },
      { x: 1800, y: 100 },
      { x: 1800, y: 900 },
    ];
  }

  public process(players: Player[]): EnemyGroupState {
    const state = {
      enemies: this.enemyServers.map((enemyServer) =>
        enemyServer.process(players)
      ),
    };

    const now = Date.now();
    if (now - this.lastSpawn >= TIME_BETWEEN_HORDES) {
      this.spawnHorde(state);
      this.lastSpawn = now;
    }
    return state;
  }

  private getEnemiesToSpawn(total_dead: number) {
    switch (this.difficulty) {
      case Difficulty.Easy:
        return total_dead * 0.25;
      case Difficulty.Medium:
        return total_dead * 0.5;
      case Difficulty.Hard:
        return total_dead * 0.75;
    }
  }

  private spawnHorde(state: EnemyGroupState) {
    const indexed = Array.from(this.enemyServers.entries());
    const dead = indexed.filter(([, enemyServer]) => enemyServer.isDead());
    const enemiesToSpawn = this.getEnemiesToSpawn(dead.length);

    for (let i = 0; i < enemiesToSpawn; i++) {
      const [j, enemy] = dead[i];
      if (enemy) {
        const spawnPoint =
          this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        const xPosition = spawnPoint.x + Math.floor(Math.random() * 100) - 50;
        const yPosition = spawnPoint.y + Math.floor(Math.random() * 100) - 50;
        state.enemies[j] = enemy.spawn(xPosition, yPosition);
      } else {
        break;
      }
    }
  }
}
