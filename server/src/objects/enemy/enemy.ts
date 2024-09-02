import "@geckos.io/phaser-on-nodejs";
import Phaser from "phaser";
import { Player } from "../../player/player.js";
import { EnemyRecentEvents, EnemyState } from "../../../../common/types/state.js";
import MovementDirection from "../../../../common/controls/direction.js";
import Observer from "../../../../common/observer/observer.js";
import EnemyBrain from "./enemyBrain.js";
import { GameEvents } from "../../types/events.js";
import { ZOMBIE_SIZE, ZOMBIE_SPEED } from "../../../../common/constants.js";
import { UnitVector } from "../../../../common/types/direction.js";
import EnemyPhysique from "./enemyPhysique.js";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  id: number;
  physique: EnemyPhysique;

  movementDirection: MovementDirection = new MovementDirection();
  observer: Observer<GameEvents>;
  brain: EnemyBrain;
  events: EnemyRecentEvents[] = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    observer: Observer<GameEvents>,
    physique?: EnemyPhysique
  ) {
    super(scene, x, y, "zombie");
    this.addToScene();

    this.id = id;
    this.observer = observer;
    this.brain = new EnemyBrain(Math.random() * 100);

    if (physique) {
      this.physique = physique;
    } else {
      const isFast = Math.random() > 0.8;
      this.physique = new EnemyPhysique(undefined, undefined, isFast ? ZOMBIE_SPEED.FAST : ZOMBIE_SPEED.SLOW);
    }
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
    this.physique.setVelocityOf(this);
  }

  public getState(): EnemyState {
    const physiqueState = this.physique.getState();
    const state = {
      position: {
        x: this.x,
        y: this.y,
      },
      // FIXME: This is a hack to avoid refactoring the client right now
      dead: this.physique.isDead(),
      health: physiqueState.health,
      speed: physiqueState.speed,
      action: this.brain.action,
      active: this.active,
      visible: this.visible,
      bodyEnabled: this.body.enable,
      movementDirection: this.movementDirection.encode(),
      events: this.events,
    };
    this.events = [];
    return state;
  }

  public receiveDamage(damage: number, damagerId: string) {
    if (this.physique.isDead()) return;
    
    this.events.push("receive_damage");
    this.physique.receiveDamage(damage);
    if (this.physique.isDead()) {
      this.beKilledBy(damagerId);
    }
  }

  public spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.physique.resetHealth();
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
  }

  private beKilledBy(killerId: string) {
    this.setVelocity(0, 0);
    this.movementDirection.update([0, 0]);
    this.body.enable = false;
    this.observer.notify("enemyKilled", killerId);

    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
