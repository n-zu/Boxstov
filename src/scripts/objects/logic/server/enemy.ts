import { EnemyState } from "../../../../typings/state";
import { Enemy } from "../../enemy";
import { Player } from "../../player";

const SPEED = 50;
const HEALTH = 100;

export const INITIAL_STATE = {
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  active: false,
  visible: false,
  bodyEnabled: false,
  health: 0,
  isFar: false,
};

export default class EnemyServer {
  enemy: Enemy;

  constructor(enemy: Enemy) {
    this.enemy = enemy;
  }

  public process(players: Player[], state: EnemyState) {
    state.bodyEnabled = this.enemy.body.enable;
    state.active = this.enemy.active;

    if (!this.enemy.body.enable || !state) return;

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
    const isFar = distance > 70 ? 1 : 0;
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
  }

  public getClosestPlayer(players: Player[]): Player {
    const state = this.enemy.nextState;
    let closestPlayer: Player = players[0];
    if (!state) return closestPlayer;

    let distanceToClosestPlayer: number | null = null;
    for (const player of players) {
      const distance = Phaser.Math.Distance.Between(
        state.position.x,
        state.position.y,
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
    const state = this.enemy.nextState;
    return !state || (state.health <= 0 && !state.active);
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
