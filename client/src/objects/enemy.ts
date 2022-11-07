import { Direction } from "./player";
import { AnimationActor, AnimationSuffix, playAnimation } from "../scenes/mainScene";
import Sprite = Phaser.GameObjects.Sprite;

const SPEED = 50;
const HEALTH = 100;

export type EnemyState = {
  position: {
    x: number;
    y: number;
  };
  health: number;
  active: boolean;
  visible: boolean;
  bodyEnabled: boolean;
};

export class Enemy extends Sprite {
  id: number;
  health = HEALTH;
  facing: Direction = Direction.Down;

  constructor(scene: Phaser.Scene, x: number, y: number, id: number) {
    super(scene, x, y, "zombie");
    scene.add.existing(this);

    this.scale = 0.75;

    this.visible = false;
    this.active = false;

    this.id = id;
  }

  public sync(state: EnemyState) {
    // There is a bug in this method
    // If the zombie is dead in the guest and revives with a sync
    // it won't play the movement animation until update() is called with this.cooldownCount = 0
    if (state.health > 0) {
      this.move(state.position.x, state.position.y);
      this.takeDamage(state.health);
    }

    this.setActive(state.active);
    this.setVisible(state.visible);
    this.active = state.active;
  }

  public receiveDamage(damage: number) {
    if (this.health <= 0) return;

    // paint red for a second
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

  public handleMessage(payload: any) {
    if (payload.type === "die") {
      this.die();
    }
  }

  private takeDamage(health: number) {
    if (health < this.health) {
      this.receiveDamage(this.health - health);
    }
  }

  private move(x: number, y: number) {
    const dx = x - this.x;
    const dy = y - this.y;

    if (dx < 0 && dy < 0) {
      this.facing = Direction.UpLeft;
    } else if (dx > 0 && dy < 0) {
      this.facing = Direction.UpRight;
    } else if (dx < 0 && dy > 0) {
      this.facing = Direction.DownLeft;
    } else if (dx > 0 && dy > 0) {
      this.facing = Direction.DownRight;
    } else if (dx < 0) {
      this.facing = Direction.Left;
    } else if (dx > 0) {
      this.facing = Direction.Right;
    } else if (dy < 0) {
      this.facing = Direction.Up;
    } else if (dy > 0) {
      this.facing = Direction.Down;
    }

    this.setDepth(this.y);
    this.setPosition(x, y);

    if (Math.random() < 0.3) {
      playAnimation(
        this,
        AnimationActor.Zombie,
        this.facing,
        AnimationSuffix.Walk
      );
    }
  }

  private die() {
    this.health = 0;
    this.setDepth(this.y - 100);

    playAnimation(this, AnimationActor.Zombie, this.facing, AnimationSuffix.Die);
    this.setRotation(Math.random() * 0.4 - 0.2);

    this.scene.time.delayedCall(10000, () => {
      this.setVisible(false);
      this.setActive(false);
    });
  }
}
