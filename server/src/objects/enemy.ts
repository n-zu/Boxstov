import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { Player } from "./player.js";
import { GameMaster } from "../gameMaster/gameMaster.js";
import { EnemyRecentEvents, EnemyState } from "../../../common/types/state.js";
import MovementDirection from "../../../common/controls/direction.js";
import Observer from "../../../common/observer/observer.js";
import EnemyBrain from "./enemyBrain.js";
import { GameEvents } from "../types/events.js";
import { ZOMBIE_SIZE, ZOMBIE_SPEED } from "../../../common/constants.js";

const HEALTH = 100;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  id: number;
  health = HEALTH;
  strength = 3;
  movementDirection: MovementDirection = new MovementDirection();
  gameMaster: GameMaster;
  observer: Observer<GameEvents>;
  brain: EnemyBrain;
  action = "walk";
  dead = true;
  speed: number;
  events: EnemyRecentEvents[] = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameMaster: GameMaster,
    id: number,
    observer: Observer<GameEvents>
  ) {
    super(scene, x, y, "zombie");
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setBodySize(...ZOMBIE_SIZE);

    this.visible = false;
    this.active = false;
    const isFast = Math.random() > 0.8;
    this.speed = isFast ? ZOMBIE_SPEED.FAST : ZOMBIE_SPEED.SLOW;

    this.brain = new EnemyBrain();
    this.gameMaster = gameMaster;
    this.id = id;
    this.observer = observer;
  }

  public async update(players: Player[]) {
    if (!this.body.enable) return;

    const canThink = this.brain.think();
    if (!canThink) return;
    if (players.length === 0) return;

    const closestPlayer = this.getClosestPlayer(players);
    const dx = closestPlayer.x - this.x;
    const dy = closestPlayer.y - this.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const isFar = distance > 150 ? 1 : 0;

    this.movementDirection.update([dx / distance, dy / distance]);
    this.setVelocity(...this.movementDirection.getSpeed(this.speed * isFar));

    this.action = isFar ? "walk" : "atk";
    if (!isFar) {
      closestPlayer.receiveDamage(
        (this.strength * this.scene.game.loop.delta) / 100
      );
    }
  }

  public getState(): EnemyState {
    const state = {
      position: {
        x: this.x,
        y: this.y,
      },
      dead: this.dead,
      health: this.health,
      active: this.active,
      visible: this.visible,
      bodyEnabled: this.body.enable,
      action: this.action,
      movementDirection: this.movementDirection.encode(),
      speed: this.speed,
      events: this.events,
    };
    this.events = [];
    return state;
  }

  public receiveDamage(damage: number, damagerId: string) {
    if (this.health <= 0) return;
    this.events.push("receive_damage");

    this.health -= damage;
    if (this.health <= 0) {
      this.beKilledBy(damagerId);
    }
  }

  public spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.health = HEALTH;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.dead = false;
  }

  // Rounds the angle to one of 8 directions
  private roundAngle(angle: number) {
    return (Math.round((angle * 4) / Math.PI) * Math.PI) / 4;
  }

  private getClosestPlayer(players: Player[]): Player {
    let closestPlayer: Player = players[0];
    let distanceToClosestPlayer: number | null = null;
    for (const player of players) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
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

  private beKilledBy(killerId: string) {
    this.health = 0;
    this.setVelocity(0, 0);
    this.movementDirection.update([0, 0]);
    this.body.enable = false;
    this.dead = true;
    this.observer.notify("enemyKilled", killerId);

    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
