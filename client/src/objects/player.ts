import { GameMaster } from "../gameMaster/gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "../groups/bulletGroup";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { Direction, UnitVector } from "../../../common/types/direction";
import DirectionVector from "../../../common/controls/direction";
import { PlayerState } from "../../../common/types/state";
import { playAnimation } from "../scenes/mainScene";
import { AnimationActor, AnimationSuffix } from "../types/animation";
import { PlayerUI } from "../controls/playerUi";
import { PlayerUpdate } from "../../../common/types/messages";

const SPEED = 200;
const SYNC_DIFF_TOLERANCE = 0.01;

export class Player extends Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  id: string;
  maxHealth = 100;
  health = 100;
  movementDirection: DirectionVector = new DirectionVector(0, 1);
  ui: PlayerUI;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    gameMaster: GameMaster,
    bulletGroup: BulletGroup
  ) {
    super(scene, x, y, "player");
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.gameMaster = gameMaster;
    this.bulletGroup = bulletGroup;
    this.ui = new PlayerUI(scene, this);

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
      const aud = new Audio("assets/shoot.mp3");
      aud.volume = 0.1;
      aud.play();
    }

    const { x: xGun, y: yGun } = this.getGunPosition();

    if (emitAlert) {
      this.gameMaster.send("player", {
        id: this.id,
        type: "shoot",
      });
    }
    this.bulletGroup.shootBullet(xGun, yGun, this.movementDirection);
  }

  public update() {
    this.ui.update();
  }

  public doMove(unit: UnitVector) {
    const direction = new DirectionVector(...unit);
    this.setVelocity(...direction.getSpeed(SPEED));
  }

  public move(direction: DirectionVector) {
    const [x, y] = direction.getSpeed(SPEED);
    this.setVelocity(x, y);
    if (this.movementDirection?.getUnitVector() !== direction.getUnitVector()) {
      this.sendMovementMessage(direction);
    }

    if (x === 0 && y === 0) {
      this.stopMovement();
      return;
    }

    this.movementDirection = direction;
    playAnimation(
      this,
      AnimationActor.Player,
      direction.getDirection(),
      AnimationSuffix.Run
    );
  }

  public sync(state: PlayerState) {
    this.syncPosition(state.position.x, state.position.y);
    this.health = state.health;
  }

  public stopMovement() {
    if (this.movementDirection) {
      this.gameMaster.send("player", {
        id: this.id,
        type: "stop",
      });
    }
    this.doStopMovement();
  }

  private doStopMovement() {
    this.setVelocity(0, 0);
    this.playIdleAnimation();
  }

  private syncPosition(x: number, y: number) {
    const diffX = Math.abs(this.x - x);
    const diffY = Math.abs(this.y - y);
    if (diffX > SYNC_DIFF_TOLERANCE || diffY > SYNC_DIFF_TOLERANCE) {
      this.setPosition(x, y);
      this.setDepth(y);
    }
  }

  private playIdleAnimation() {
    const animationName = `${
      AnimationActor.Player
    }-${this.movementDirection?.getDirection()}-${AnimationSuffix.Idle}`;
    this.anims.play(animationName, true);
  }

  private sendMovementMessage(direction: DirectionVector) {
    this.gameMaster.send("player", {
      id: this.id,
      type: "move",
      direction: direction.getUnitVector(),
    });
  }

  private getGunPosition(): { x: number; y: number } {
    // We should change this logic so that the bullet receives the position and angle
    // of shooting, so that the bullet travels parallel to the player's gun
    switch (this.movementDirection?.getDirection()) {
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
      default:
        return {
          x: this.x + 45,
          y: this.y - 10,
        };
    }
  }
}
