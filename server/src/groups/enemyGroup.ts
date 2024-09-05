import { Enemy } from "../objects/enemy/enemy.js";
import { Player } from "../player/player.js";
import { EnemyGroupState, EnemyState, SpawnPoint } from "../../../common/types/state.js";
import Observer from "../../../common/observer/observer.js";
import config from "../../../common/config.js";
import EnemyPhysique from "../objects/enemy/enemyPhysique.js";
import { GameEvents } from "../../../common/types/events.js";

const TIME_BETWEEN_HORDES = 700;

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  difficulty: Difficulty;
  timeUntilNextHorde = 0;
  spawnPoints: SpawnPoint[];
  observer: Observer<GameEvents>;

  constructor(
    scene: Phaser.Scene,
    observer: Observer<GameEvents>,
    difficulty: Difficulty,
    spawnPoints: SpawnPoint[],
  ) {
    super(scene.physics.world, scene);
    this.observer = observer;

    const enemies: Enemy[] = [];
    for (let i = 0; i < config.misc.maxEnemies; i++) {
      const isFast = Math.random() < config.misc.zombieFastProbability;
      let physique;
      if (isFast) {
        physique = new EnemyPhysique(
          config.enemies.zombieFast.health,
          config.enemies.zombieFast.strength,
          config.enemies.zombieFast.speed,
          config.enemies.zombieFast.attackRange
          );
      } else {
        physique = new EnemyPhysique(
          config.enemies.zombieNormal.health,
          config.enemies.zombieNormal.strength,
          config.enemies.zombieNormal.speed,
          config.enemies.zombieNormal.attackRange
        );
      }
      enemies.push(new Enemy(scene, 0, 0, i, observer, physique));
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
      spawnPoints: this.spawnPoints
    };
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
