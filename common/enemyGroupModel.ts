import config from "./config.js";
import { EnemyModel } from "./enemy/enemyModel.js";
import EnemyPhysiqueModel from "./enemy/enemyPhysiqueModel.js";
import { Position } from "./generated/utils/position.js";
import Observer from "./observer/observer.js";
import PlayerModel from "./playerModel.js";
import { GameEvents } from "./types/events.js";
import { getPrng } from "./utils.js";

const TIME_BETWEEN_HORDES = 700;
const prng = getPrng(42);

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export abstract class EnemyGroupModel extends Phaser.Physics.Arcade.Group {
  difficulty: Difficulty;
  timeUntilNextHorde = 0;
  spawnPoints: Position[];
  observer: Observer<GameEvents>;

  constructor(
    scene: Phaser.Scene,
    observer: Observer<GameEvents>,
    difficulty: Difficulty,
    spawnPoints: Position[],
    enemyFactory: (id: number, scene: Phaser.Scene, position: { x: number, y: number }, observer: Observer<GameEvents>, physique: EnemyPhysiqueModel) => EnemyModel
  ) {
    super(scene.physics.world, scene);
    this.observer = observer;

    const enemies: EnemyModel[] = [];
    for (let i = 0; i < config.misc.maxEnemies; i++) {
      const isFast = prng() < config.misc.zombieFastProbability;
      let physique;
      if (isFast) {
        physique = this.newFastEnemyPhysique(
          config.enemies.zombieFast.health,
          config.enemies.zombieFast.strength,
          config.enemies.zombieFast.speed,
          config.enemies.zombieFast.attackRange
        );
      } else {
        physique = this.newNormalEnemyPhysique(
          config.enemies.zombieNormal.health,
          config.enemies.zombieNormal.strength,
          config.enemies.zombieNormal.speed,
          config.enemies.zombieNormal.attackRange
        );
      }
      enemies.push(enemyFactory(i, scene, { x: 0, y: 0 }, observer, physique));
    }

    this.addMultiple(enemies);

    this.difficulty = difficulty;
    this.spawnPoints = spawnPoints;
  }

  protected abstract newNormalEnemyPhysique(health: number, strength: number, speed: number, attackRange: number): EnemyPhysiqueModel;

  protected abstract newFastEnemyPhysique(health: number, strength: number, speed: number, attackRange: number): EnemyPhysiqueModel;

  public update(players: PlayerModel[]) {
    const enemies = this.getMatching("active", true) as EnemyModel[];
    enemies.forEach((e) => {
      e.update(players);
    });
    this.timeUntilNextHorde -= 1;
    if (this.timeUntilNextHorde <= 0) {
      this.spawnHorde();
      this.timeUntilNextHorde = TIME_BETWEEN_HORDES;
    }
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
      const enemy = this.getFirstDead(false) as EnemyModel;
      if (enemy) {
        const spawnPoint =
          this.spawnPoints[Math.floor(prng() * this.spawnPoints.length)];
        const xPosition = spawnPoint.x + Math.floor(prng() * 100) - 50;
        const yPosition = spawnPoint.y + Math.floor(prng() * 100) - 50;

        enemy.spawn(xPosition, yPosition);
      } else {
        break;
      }
    }
  }
}
