import Sprite = Phaser.Physics.Arcade.Sprite;
import {
  AnimationActor,
  AnimationSuffix,
  playAnimation,
} from "../scenes/mainScene";
import { Direction } from "../../typings/direction";
import { EnemyState } from "../../typings/state";

export class Enemy extends Sprite {
  id: number;
  health: number;
  died: boolean;
  facing: Direction = Direction.Down;
  nextState?: EnemyState;

  constructor(scene: Phaser.Scene, x: number, y: number, id: number) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 0.75;
    this.setBodySize(80, 180);
    this.visible = false;
    this.active = false;
    this.id = id;
  }

  public update() {
    this.sync();

    const state = this.nextState;
    if (!state || !state.active) return;

    if (state.health <= 0) {
      if (!this.died) this.die();
      return;
    }

    const direction = this.getMovementDirection(
      state.velocity.x,
      state.velocity.y
    );

    if (direction) {
      this.facing = direction;
      const suffix = !state.isFar
        ? AnimationSuffix.Attack
        : AnimationSuffix.Walk;
      playAnimation(this, AnimationActor.Zombie, this.facing, suffix);
    }
    this.setDepth(this.y);
  }

  private sync() {
    // There is a bug in this method
    // If the zombie is dead in the guest and revives with a sync
    // it won't play the movement animation until update() is called with this.cooldownCount = 0
    const state = this.nextState;
    if (!state) return;
    if (state.active) {
      this.setPosition(state.position.x, state.position.y);
      this.setVelocity(state.velocity.x, state.velocity.y);
      this.setDepth(this.y);
    }

    this.setActive(state.active);
    this.setVisible(state.visible);
    this.active = state.active;
    this.body.enable = state.bodyEnabled;
    this.health = state.health;
    if (state.health > 0) {
      this.died = false;
    }
  }

  public receiveDamage(damage: number) {
    if (this.health <= 0) return;

    this.health -= damage;

    // paint red for a second
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this && this.clearTint();
    });
  }

  private die() {
    this.health = 0;
    this.died = true;
    this.setVelocity(0, 0);
    this.setDepth(this.y - 100);
    this.body.enable = false;

    playAnimation(
      this,
      AnimationActor.Zombie,
      this.facing,
      AnimationSuffix.Die
    );
    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setActive(false);
      this.setVisible(false);
    });
  }

  private getMovementDirection(
    xMovement: number,
    yMovement: number
  ): Direction {
    if (xMovement > 0 && yMovement > 0) {
      return Direction.DownRight;
    }
    if (xMovement > 0 && yMovement < 0) {
      return Direction.UpRight;
    }
    if (xMovement < 0 && yMovement > 0) {
      return Direction.DownLeft;
    }
    if (xMovement < 0 && yMovement < 0) {
      return Direction.UpLeft;
    }
    if (xMovement > 0) {
      return Direction.Right;
    }
    if (xMovement < 0) {
      return Direction.Left;
    }
    if (yMovement > 0) {
      return Direction.Down;
    }
    if (yMovement < 0) {
      return Direction.Up;
    }
    return Direction.Down;
  }
}
