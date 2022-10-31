import { EnemyState } from "../../../typings/state";
import { Enemy } from "../enemy";
import { Player } from "../player";

const SPEED = 50;
const HEALTH = 100;

export default class EnemyServer {
  enemy: Enemy;

  constructor(enemy: Enemy) {
    this.enemy = enemy;
  }

  public process(players: Player[]): EnemyState {
    const state = this.enemy.getState();
    state.bodyEnabled = this.enemy.body.enable;
    state.active = this.enemy.active;

    if (!state.bodyEnabled || !state) return state;

    state.position = { x: this.enemy.x, y: this.enemy.y };

    const closestPlayer = this.getClosestPlayer(players);
    const angle = Phaser.Math.Angle.Between(
      state.position.x,
      state.position.y,
      closestPlayer.x,
      closestPlayer.y
    );
    const distance = Phaser.Math.Distance.Between(
      state.position.x,
      state.position.y,
      closestPlayer.x,
      closestPlayer.y
    );
    const isFar = distance > 150 ? 1 : 0;
    let xUnit = Math.cos(angle);
    let yUnit = Math.sin(angle);
    xUnit = Math.abs(xUnit) < 0.3 ? 0 : xUnit;
    yUnit = Math.abs(yUnit) < 0.3 ? 0 : yUnit;
    const velocityX = xUnit * SPEED;
    const velocityY = yUnit * SPEED;

    state.velocity.x = velocityX * isFar;
    state.velocity.y = velocityY * isFar;
    state.isFar = Boolean(isFar);
    state.health = this.enemy.health || 0;
    return state;
  }

  public getClosestPlayer(players: Player[]): Player {
    let closestPlayer: Player = players[0];

    let distanceToClosestPlayer: number | null = null;
    for (const player of players) {
      const distance = Phaser.Math.Distance.Between(
        this.enemy.body.position.x,
        this.enemy.body.position.y,
        player.x,
        player.y
      );
      if (
        distanceToClosestPlayer === null ||
        distance < distanceToClosestPlayer
      ) {
        closestPlayer = player;
        distanceToClosestPlayer = distance;
      }
    }
    return closestPlayer;
  }

  public isDead(): boolean {
    return this.enemy.health <= 0 && !this.enemy.active;
  }

  public spawn(x: number, y: number): EnemyState {
    return {
      position: { x, y },
      velocity: { x: 0, y: 0 },
      active: true,
      visible: true,
      bodyEnabled: true,
      health: HEALTH,
      isFar: false,
    };
  }
}
