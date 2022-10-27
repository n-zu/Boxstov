import Sprite = Phaser.Physics.Arcade.Sprite;
import { Direction, Player } from "./player";
import { AnimationActor, AnimationSuffix } from "../scenes/mainScene";

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

    this.scale = 0.8;
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
    const velocityX = Math.cos(angle) * SPEED;
    const velocityY = Math.sin(angle) * SPEED;

    this.setVelocityX(velocityX * isFar);
    this.setVelocityY(velocityY * isFar);

    const direction = this.getMovementAnimationDirection(
      velocityX,
      velocityY,
      2
    );

    if (direction) {
      this.facing = direction;
      this.playAnimation(direction, isFar === 0);
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
        frame: this.anims.currentFrame.index
      };
    }
    return {
      position: {
        x: this.x,
        y: this.y
      },
      velocity: {
        x: this.body.velocity.x,
        y: this.body.velocity.y
      },
      rotation: this.rotation,
      animation: currentAnimation,
      health: this.health,
      active: this.active,
      visible: this.visible
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
    this.playAnimation(this.facing, false);
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
  }

  private playAnimation(direction: Direction, attack: boolean) {
    const suffix = attack ? AnimationSuffix.Attack : AnimationSuffix.Run;
    this.anims.play(`${AnimationActor.Zombie}-${direction}-${suffix}`, true);
  }

  private getMovementAnimationDirection(
    xMovement: number,
    yMovement: number,
    precision: number
  ): Direction | undefined {
    let xDir;
    let yDir;
    if (xMovement < -precision) {
      xDir = Direction.Left;
    } else if (xMovement > precision) {
      xDir = Direction.Right;
    }

    if (yMovement < -precision) {
      yDir = Direction.Up;
    } else if (yMovement > precision) {
      yDir = Direction.Down;
    }

    if (xDir === Direction.Left && yDir === Direction.Up) {
      return Direction.UpLeft;
    } else if (xDir === Direction.Right && yDir === Direction.Up) {
      return Direction.UpRight;
    } else {
      return xDir || yDir;
    }
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

  private playDeathAnimation() {
    this.anims.play(`${AnimationActor.Zombie}-${this.facing}-${AnimationSuffix.Die}`, true);
  }

  private die() {
    this.setVelocity(0, 0);
    this.body.enable = false;
    this.playDeathAnimation();

    this.scene.time.delayedCall(3000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
