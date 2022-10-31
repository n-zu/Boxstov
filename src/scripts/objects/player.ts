import { GameMaster } from "../gameMaster/gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "../groups/bulletGroup";
import {
  AnimationActor,
  AnimationSuffix,
  playAnimation,
} from "../scenes/mainScene";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { PlayerUpdatePayload } from "../../typings/action";
import { Direction } from "../../typings/direction";
import { PlayerState } from "../../typings/state";
import DirectionVector from "../controls/direction";

const SPEED = 200;

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

const stringToColor = (str: string): number => {
  // TODO: test this. seems to like green.
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "0x";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    const adjustedValue = lerp(value, 0xff, 0.9);
    color += ("00" + adjustedValue.toString(16)).substr(-2);
  }
  return Number(color);
};

export class Player extends Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  id: string;
  facing: DirectionVector;
  maxHealth = 100;
  health = 100;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    gameMaster: GameMaster,
    bulletGroup: BulletGroup
  ) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.scene = scene;
    this.gameMaster = gameMaster;
    this.bulletGroup = bulletGroup;
    this.facing = new DirectionVector();
    this.setTint(stringToColor(id));

    playAnimation(
      this,
      AnimationActor.Player,
      Direction.Down,
      AnimationSuffix.Idle
    );
  }

  public getId() {
    return this.id;
  }

  public shoot(emitAlert = true) {
    {
      const aud = new Audio("/assets/shoot.mp3");
      aud.volume = 0.1;
      aud.play();
    }

    const { x: xGun, y: yGun } = this.getGunPosition();

    if (emitAlert) {
      this.gameMaster.send("player", {
        id: this.id,
        payload: {
          type: "shoot",
        },
      });
    }
    this.bulletGroup.shootBullet(xGun, yGun, this.facing);
  }

  public move(dir: DirectionVector, emitAlert = true) {
    const [x, y] = dir.getSpeed(SPEED);
    this.setVelocity(x, y);
    if (emitAlert) {
      this.sendMovementMessage(dir);
    }

    if (x === 0 && y === 0) {
      this.stopMovement();
      return;
    }

    this.facing = dir;
    const direction = dir.getDirection();
    playAnimation(this, AnimationActor.Player, direction, AnimationSuffix.Run);
  }

  public stopMovement(emitAlert = true) {
    if (emitAlert)
      this.gameMaster.send("player", {
        id: this.id,
        payload: {
          type: "stop",
        },
      });
    this.playIdleAnimation();
    this.setVelocity(0, 0);
  }

  public sync(state: PlayerState) {
    const lerp_factor = 0.1;
    this.setPosition(
      lerp(this.x, state.position.x, lerp_factor),
      lerp(this.y, state.position.y, lerp_factor)
    );
    this.setDepth(state.position.y);
    this.health = state.health;
  }

  public getState(): PlayerState {
    this.setDepth(this.y);
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
      health: this.health,
    };
  }

  public handleMessage(message: PlayerUpdatePayload) {
    switch (message.type) {
      case "move":
        this.move(new DirectionVector(...message.direction), false);
        break;
      case "stop":
        this.stopMovement(false);
        break;
      case "shoot":
        this.shoot(false);
        break;
    }
  }

  /*
  private syncPosition(position: { x: number; y: number }) {
    const diffX = Math.abs(this.x - position.x);
    const diffY = Math.abs(this.y - position.y);
    if (diffX > SYNC_DIFF_TOLERANCE || diffY > SYNC_DIFF_TOLERANCE) {
      this.setPosition(position.x, position.y);
    } else {
      console.log("Not syncing player position because it is too close");
    }
  }
*/
  private playIdleAnimation() {
    const dir = this.facing.getDirection();
    const animationName = `${AnimationActor.Player}-${dir}-${AnimationSuffix.Idle}`;
    this.anims.play(animationName, true);
  }

  private sendMovementMessage(direction: DirectionVector) {
    this.gameMaster.send("player", {
      id: this.id,
      payload: {
        type: "move",
        direction: direction.getUnitVector(),
      },
    });
  }

  private getGunPosition(): { x: number; y: number } {
    // We should change this logic so that the bullet receives the position and angle
    // of shooting, so that the bullet travels parallel to the player's gun
    switch (this.facing.getDirection()) {
      case Direction.Up:
        return {
          x: this.x + 15,
          y: this.y - 120,
        };
      case Direction.Down:
        return {
          x: this.x - 16,
          y: this.y,
        };
      case Direction.Left:
        return {
          x: this.x - 95,
          y: this.y - 75,
        };
      case Direction.Right:
        return {
          x: this.x + 95,
          y: this.y - 65,
        };
      case Direction.UpLeft:
        return {
          x: this.x - 75,
          y: this.y - 120,
        };
      case Direction.UpRight:
        return {
          x: this.x + 95,
          y: this.y - 120,
        };
      case Direction.DownLeft:
        return {
          x: this.x - 35,
          y: this.y - 40,
        };
      case Direction.DownRight:
        return {
          x: this.x + 45,
          y: this.y - 10,
        };
    }
  }
}
