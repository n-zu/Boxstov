import Sprite = Phaser.Physics.Arcade.Sprite;
import { Player } from "./player";

const SPEED = 5;

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
    super(scene, x, y, "player");
    this.setTint(0xff0000);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (id) {
      this.id = id;
    } else {
      this.id = Phaser.Math.RND.uuid();
    }
  }

  public update(players: Player[]) {
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

    const absVelocityX = Math.abs(velocityX);
    const absVelocityY = Math.abs(velocityY);
    if (absVelocityX > absVelocityY) {
      if (velocityX > 0) {
        this.anims.play("right", true);
      } else {
        this.anims.play("left", true);
      }
    } else {
      if (velocityY > 0) {
        this.anims.play("down", true);
      } else {
        this.anims.play("up", true);
      }
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
