import Sprite = Phaser.Physics.Arcade.Sprite;
import { Player } from "./player";

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

    this.scale = 0.5;

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
    const velocityX = Math.cos(angle) * SPEED;
    const velocityY = Math.sin(angle) * SPEED;

    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);

    let yMovement = "idle";
    let xMovement = "idle";

    if (velocityY < 0) {
      yMovement = "up";
    } else if (velocityY > 0) {
      yMovement = "down";
    }
    if (velocityX < 0) {
      xMovement = "left";
    } else if (velocityX > 0) {
      xMovement = "right";
    }

    // I do this to avoid the diagonal animations when little movement is happening in the x or y-axis
    if (
      yMovement !== "idle" &&
      xMovement !== "idle" &&
      Math.abs(velocityX) > 15 &&
      Math.abs(velocityY) > 15
    ) {
      this.anims.play(`zombie-${yMovement}-${xMovement}`, true);
    } else if (
      yMovement !== "idle" &&
      Math.abs(velocityY) > Math.abs(velocityX)
    ) {
      this.anims.play(`zombie-${yMovement}`, true);
    } else if (
      xMovement !== "idle" &&
      Math.abs(velocityX) > Math.abs(velocityY)
    ) {
      this.anims.play(`zombie-${xMovement}`, true);
    }
  }

  public sync(state: EnemyState) {
    this.setPosition(state.position.x, state.position.y);
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.setRotation(state.rotation);
    if (state.animation) {
      this.anims.play(state.animation.key, true);
    }
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
      id: this.id,
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
    };
  }

  private getClosesPlayer(players: Player[]): Player {
    let closestPlayer: Player = players[0];
    let distanceToClosestPlayer: number | null = null;
    for (let player of players) {
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
