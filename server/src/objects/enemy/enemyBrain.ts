import { Player } from "../../player/player";
import { Enemy } from "./enemy";

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

  public update(me: Enemy, players: Player[]) {
    if (!me.body.enable) return;

    if (!this.canThink()) return;
    if (players.length === 0) return;

    const closestPlayer = this.getClosestPlayer(me, players);
    const dx = closestPlayer.x - me.x;
    const dy = closestPlayer.y - me.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    me.turn([dx / distance, dy / distance]);
    
    if (me.physique.canAttack(me, closestPlayer)) {
      this.action = "atk";
      closestPlayer.receiveDamage(
        (me.physique.strength * me.scene.game.loop.delta) / 100
      );
    } else {
      this.action = "walk";
    }
  }

  private getClosestPlayer(me: Enemy, players: Player[]): Player {
    let closestPlayer: Player = players[0];
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