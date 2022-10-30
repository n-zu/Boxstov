import Sprite = Phaser.Physics.Arcade.Sprite;
import { Player } from "./player";
import {
  AnimationActor,
  AnimationSuffix,
  playAnimation,
} from "../scenes/mainScene";
import { GameMaster } from "../gameMaster/gameMaster";
import { Direction, EnemyUpdate } from "../../typings/action";

const SPEED = 50;
const HEALTH = 100;

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  health: number;
  active: boolean;
  visible: boolean;
  bodyEnabled: boolean;
  cooldown: number;
  cooldownCount: number;
};

export class Enemy extends Sprite {
  id: number;
  health = HEALTH;
  facing: Direction = Direction.Down;
  gameMaster: GameMaster;
  cooldown = Math.random() * 100;
  cooldownCount = this.cooldown;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameMaster: GameMaster,
    id: number
  ) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 0.75;
    this.setBodySize(80, 180);

    this.visible = false;
    this.active = false;

    this.gameMaster = gameMaster;
    this.id = id;
  }

  public update(players: Player[]) {
    // This allows random movement and improves performance by not updating
    // the enemy every frame. We should consider the consequences of using
    // randomness, because the guest will calculate a different path. Maybe
    // we should use a seed
    if (!this.body.enable) return;
    if (this.health <= 0) {
      this.die();
      return;
    }

    if (this.cooldownCount > 0) {
      this.cooldownCount--;
      return;
    }
    this.cooldownCount = this.cooldown;

    const closestPlayer = this.getClosestPlayer(players);
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
    // There is a bug in this method
    // If the zombie is dead in the guest and revives with a sync
    // it won't play the movement animation until update() is called with this.cooldownCount = 0
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
    this.cooldown = state.cooldown;
    this.cooldownCount = state.cooldownCount;
  }

  public getState(): EnemyState {
    return {
      position: {
        x: this.x,
        y: this.y,
      },
      velocity: {
        x: this.body.velocity.x,
        y: this.body.velocity.y,
      },
      health: this.health,
      active: this.active,
      visible: this.visible,
      bodyEnabled: this.body.enable,
      cooldown: this.cooldown,
      cooldownCount: this.cooldownCount,
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
  }

  public spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.health = HEALTH;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
  }

  public handleMessage(payload: EnemyUpdate) {
    // @ts-ignore
    if (payload.type === "die") {
      this.die();
    }
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

  private getClosestPlayer(players: Player[]): Player {
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
    this.health = 0;
    this.setVelocity(0, 0);
    this.setDepth(this.y - 100);
    this.body.enable = false;
    const update: EnemyUpdate = {
      type: "die",
      id: this.id,
    };

    this.gameMaster.broadcast("enemy", update);

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
