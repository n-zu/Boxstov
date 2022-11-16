import { playAnimation } from "../scenes/mainScene";
import { EnemyState } from "../../../common/types/state";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { AnimationActor, AnimationSuffix } from "../types/animation";
import MovementDirection from "../../../common/controls/direction";

const SPEED = 50;
const HEALTH = 100;

export class Enemy extends Sprite {
  id: number;
  health = HEALTH;
  movementDirection: MovementDirection = new MovementDirection();
  redTint = 0;
  action = "";
  dead: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, id: number) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);

    this.visible = false;
    this.active = false;

    this.id = id;
  }

  public sync(state: EnemyState) {
    if (state.health > 0) {
      this.updateHealth(state.health);
    }
    this.move(state);
    if (!this.dead && state.dead) {
      this.die();
    }
    this.dead = state.dead;
    this.setActive(state.active);
    this.setVisible(state.visible);
    this.active = state.active;
    this.action = state.action;
  }

  public receiveDamage(damage: number) {
    this.redTint = 1;
    if (this.health <= 0) return;

    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

  private updateHealth(newHealth: number) {
    if (newHealth < this.health) this.receiveDamage(this.health - newHealth);
    else this.redTint *= 0.9 / this.scene.time.timeScale;

    this.setTint(0xff0000 + 0x00ffff * (1 - this.redTint));
  }

  private move(state: EnemyState) {
    this.setPosition(state.position.x, state.position.y);
    this.setDepth(state.position.y);

    this.setVelocity(...this.movementDirection.getSpeed(SPEED));

    if (!this.movementDirection.isStill() && Math.random() < 0.3) {
      playAnimation(
        this,
        AnimationActor.Zombie,
        this.movementDirection.getFacingDirection(),
        this.action === AnimationSuffix.Attack
          ? AnimationSuffix.Attack
          : AnimationSuffix.Walk
      );
    }
  }

  private die() {
    this.health = 0;
    this.setTint(0xff5555);
    setTimeout(() => this.setTint(0xffdddd), 1000);
    this.setDepth(this.y - 100);

    playAnimation(
      this,
      AnimationActor.Zombie,
      this.movementDirection.getFacingDirection(),
      AnimationSuffix.Die
    );
    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
