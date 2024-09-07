import PlayerModel from "../playerModel";
import { EnemyModel } from "./enemyModel";

export default class EnemyBrain {
  cooldown: number;
  cooldownCount: number;
  action: string;

  constructor(cooldown: number) {
    this.cooldown = cooldown;
    this.cooldownCount = cooldown;
    this.action = "walk";
  }

  private canThink(): boolean {
    this.cooldownCount--;
    if (this.cooldownCount <= 0) {
      this.cooldownCount = this.cooldown;
      return true;
    }
    return false;
  }

  public update(me: EnemyModel, players: PlayerModel[]) {
    if (!me.body.enable) return;

    if (!this.canThink()) return;
    if (players.length === 0) return;

    const closestPlayer = this.getClosestPlayer(me, players);
    const angle = this.calculateAngleWithPlayer(me, closestPlayer);
    me.turn(angle);
    
    if (me.physique.canAttack(me, closestPlayer)) {
      this.action = "atk";
      closestPlayer.receiveDamage(
        (me.physique.strength * me.scene.game.loop.delta) / 100
      );
    } else {
      this.action = "walk";
    }
  }

  private calculateAngleWithPlayer(me: EnemyModel, player: PlayerModel): number {
    const dx = player.x - me.x;
    const dy = player.y - me.y;
    return -Math.atan2(dy, dx);
  }

  private getClosestPlayer(me: EnemyModel, players: PlayerModel[]): PlayerModel {
    let closestPlayer: PlayerModel = players[0];
    let distanceToClosestPlayer: number | null = null;
    for (const player of players) {
      const distance = Phaser.Math.Distance.Between(
        me.x,
        me.y,
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
}