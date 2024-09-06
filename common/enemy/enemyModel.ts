import { EnemyState } from "../types/state.js";
import MovementDirection from "../controls/direction.js";
import Observer from "../observer/observer.js";
import EnemyBrain from "./enemyBrain.js";
import { UnitVector } from "../types/direction.js";
import EnemyPhysique from "./enemyPhysique.js";
import config from "../config.js";
import { GameEvents } from "../types/events.js";
import PlayerModel from "../playerModel.js";

export class EnemyModel extends Phaser.Physics.Arcade.Sprite {
  id: number;
  physique: EnemyPhysique;

  movementDirection: MovementDirection = new MovementDirection();
  observer: Observer<GameEvents>;
  brain: EnemyBrain;

  constructor(
    id: number,
    scene: Phaser.Scene,
    position: { x: number; y: number },
    observer: Observer<GameEvents>,
    physique: EnemyPhysique,
    sprite: string = ""
  ) {
    super(scene, position.x, position.y, sprite);
    this.addToScene();

    this.id = id;
    this.observer = observer;
    this.brain = new EnemyBrain(Math.random() * 100);
    this.physique = physique;
  }

  private addToScene() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setBodySize(config.misc.enemySize.width, config.misc.enemySize.height);

    this.visible = false;
    this.active = false;
  }

  public async update(players: PlayerModel[]) {
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
    };
    return state;
  }

  public receiveDamage(damage: number, damager?: PlayerModel) {
    if (this.physique.isDead()) return;
    
    // FIXME: This event is disabled for now
    // this.observer.notify("enemyReceivedDamage", this.id);
    this.physique.receiveDamage(damage);
    if (this.physique.isDead() && damager) {
      this.beKilledBy(damager);
    }
  }

  public spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.physique.resetHealth();
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
  }

  private beKilledBy(killer: PlayerModel) {
    this.setVelocity(0, 0);
    this.movementDirection.update([0, 0]);
    this.body.enable = false;
    this.observer.notify("playerKill", killer);

    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
