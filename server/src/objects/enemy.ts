import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { Player } from "../player/player.js";
import { EnemyRecentEvents, EnemyState } from "../../../common/types/state.js";
import MovementDirection from "../../../common/controls/direction.js";
import Observer from "../../../common/observer/observer.js";
import EnemyBrain from "./enemyBrain.js";
import { GameEvents } from "../types/events.js";
import { ZOMBIE_SIZE, ZOMBIE_SPEED } from "../../../common/constants.js";
import { UnitVector } from "../../../common/types/direction.js";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  id: number;
  maxHealth: number;
  health: number;
  strength: number;
  speed: number;
  attackRange: number;

  movementDirection: MovementDirection = new MovementDirection();
  observer: Observer<GameEvents>;
  brain: EnemyBrain;
  action = "walk";
  dead = true;
  events: EnemyRecentEvents[] = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    observer: Observer<GameEvents>,
    health: number = 100,
    strength: number = 3,
    attackRange: number = 150,
  ) {
    super(scene, x, y, "zombie");
    this.addToScene();

    this.id = id;
    this.observer = observer;
    const isFast = Math.random() > 0.8;
    this.speed = isFast ? ZOMBIE_SPEED.FAST : ZOMBIE_SPEED.SLOW;
    this.brain = new EnemyBrain(Math.random() * 100);

    this.maxHealth = health;
    this.health = health;
    this.strength = strength;
    this.attackRange = attackRange;
  }

  private addToScene() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBodySize(...ZOMBIE_SIZE);

    this.visible = false;
    this.active = false;
  }

  public async update(players: Player[]) {
    this.brain.update(this, players);
  }

  public turn(v: UnitVector) {
    this.movementDirection.update(v);
    this.setVelocity(...this.movementDirection.getSpeed(this.speed));
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
    this.health = this.maxHealth;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.dead = false;
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
