import Sprite = Phaser.Physics.Arcade.Sprite;
import { Direction, Player } from "./player";
import {
  AnimationActor,
  AnimationSuffix,
  playAnimation,
} from "../scenes/mainScene";

const SPEED = 50;

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  rotation: number;
  animation?: {
    key: string;
    frame: number;
  };
  health: number;
  active: boolean;
  visible: boolean;
};

export class Enemy extends Sprite {
  health = 100;
  facing: Direction = Direction.Down;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 0.75;
    this.setBodySize(80, 180);
  }

  public update(players: Player[]) {
    // This allows random movement and improves performance by not updating
    // the enemy every frame. We should consider the consequences of using
    // randomness, because the guest will calculate a different path. Maybe
    // we should use a seed
    if (Math.random() < 0.95) return;

    if (!this.body.enable) return;

    const closestPlayer = this.getClosesPlayer(players);
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      closestPlayer.x,
      closestPlayer.y
    );
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
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

    this.setVelocityX(velocityX * isFar);
    this.setVelocityY(velocityY * isFar);

    const direction = this.getMovementDirection(velocityX, velocityY);

    if (direction) {
      this.facing = direction;
      const suffix = isFar == 0 ? AnimationSuffix.Attack : AnimationSuffix.Walk;
      playAnimation(this, AnimationActor.Zombie, this.facing, suffix);
    }
    this.setDepth(this.y);
  }

  public sync(state: EnemyState) {
    this.setPosition(state.position.x, state.position.y);
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
    this.setDepth(this.y);
    if (state.animation) {
      this.anims.play(state.animation.key, true);
    }
    this.setActive(state.active);
    this.setVisible(state.visible);
    this.body.enable = state.active;
  }

  public getState(): EnemyState {
    let currentAnimation: { key: string; frame: number } | undefined;
    if (this.anims.currentAnim && this.anims.currentFrame) {
      currentAnimation = {
        key: this.anims.currentAnim.key,
        frame: this.anims.currentFrame.index,
      };
    }
    return {
      position: {
        x: this.x,
        y: this.y,
      },
      velocity: {
        x: this.body.velocity.x,
        y: this.body.velocity.y,
      },
      rotation: this.rotation,
      animation: currentAnimation,
      health: this.health,
      active: this.active,
      visible: this.visible,
    };
  }

  public receiveDamage(damage: number) {
    if (this.health <= 0) return;

    this.health -= damage;

    // paint red for a second
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this && this.clearTint();
    });

    if (this.health <= 0) this.die();
  }

  public spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.health = 100;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
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

  private getClosesPlayer(players: Player[]): Player {
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

  private die() {
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
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
