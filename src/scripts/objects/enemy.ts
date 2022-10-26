import Sprite = Phaser.Physics.Arcade.Sprite;
import { Direction, Player } from "./player";
import { AnimationSuffix } from "../scenes/mainScene";

const SPEED = 50;

export type EnemyState = {
  id: string;
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
};

export class Enemy extends Sprite {
  id: string;

  constructor(scene: Phaser.Scene, x: number, y: number, id?: string) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 0.8;
    this.setBodySize(50, 80);

    if (id) {
      this.id = id;
    } else {
      this.id = Phaser.Math.RND.uuid();
    }
  }

  public update(players: Player[]) {
    // This allows random movement and improves performance by not updating
    // the enemy every frame. We should consider the consequences of using
    // randomness, because the guest will calculate a different path. Maybe
    // we should use a seed
    if (Math.random() < 0.95) {
      return;
    }
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
      id: this.id,
      position: {
        x: this.x,
        y: this.y
      },
      velocity: {
        x: this.body.velocity.x,
        y: this.body.velocity.y
      },
      rotation: this.rotation,
      animation: currentAnimation
    };
  }

  private playAnimation(direction: Direction, attack: boolean) {
    const suffix = attack ? AnimationSuffix.Attack : AnimationSuffix.Run;
    this.anims.play(`zombie-${direction}-${suffix}`, true);
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
}
