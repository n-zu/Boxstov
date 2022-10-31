import { GameMaster } from "../gameMaster/gameMaster";
import * as Phaser from "phaser";
import { BulletGroup } from "../groups/bulletGroup";
import {
  AnimationActor,
  AnimationSuffix,
  playAnimation,
  SYNC_MS,
} from "../scenes/mainScene";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { PlayerUpdatePayload } from "../../typings/action";
import { Direction } from "../../typings/direction";
import { PlayerState } from "../../typings/state";
import DirectionVector from "../controls/direction";

const SPEED = 200;

// Cuantas unidades tiene que estar desviado para corregir
// en 1 ciclo de SYNC_MS. Si esta desviado menos, la correccion
// sera menor. Si esta desviado mas, la correccion sera mayor.
// Usa una fórmula exponencial.
const CORRECT_AVG = 5;
const ACCEPTABLE_DEVIATION = 0.1; // Si diff es menor a esto, no se corrige

type VelocityCorrection = {
  x: number;
  y: number;
};

export class Player extends Sprite {
  scene: Phaser.Scene;
  gameMaster: GameMaster;
  bulletGroup: BulletGroup;
  id: string;
  facing: DirectionVector;
  maxHealth = 100;
  health = 100;
  velocityCorrection: VelocityCorrection;
  readonly CORRECTION_FACTOR = (SYNC_MS / 1000 + 1) ** (1 / CORRECT_AVG);

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
    this.velocityCorrection = { x: 0, y: 0 };

    this.setBodySize(180, 220);
    this.setDisplaySize(250, 250);
    this.setDisplayOrigin(250, 320);
    this.setOffset(160, 240);

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
    this.setVelocity(state.velocity.x, state.velocity.y);
    this.updateVelocityCorrection(state);
    this.setDepth(state.position.y);
    this.health = state.health;
  }

  public setVelocity(x: number, y?: number): this {
    super.setVelocity(
      x + this.velocityCorrection.x,
      (y || 0) + this.velocityCorrection.y
    );
    return this;
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

  private updateVelocityCorrection(updatedState: PlayerState) {
    const x = this.getVelocityCorrection(this.x, updatedState.position.x);
    const y = this.getVelocityCorrection(this.y, updatedState.position.y);
    console.log("Correction: ", x, y);
    this.velocityCorrection = { x, y };
  }

  private getVelocityCorrection(old_pos: number, new_pos: number) {
    const diff = new_pos - old_pos;
    const abs = Math.abs(diff);
    console.log("Diff: ", diff);
    if (abs < ACCEPTABLE_DEVIATION) {
      return 0;
    }
    return (this.CORRECTION_FACTOR ** abs + 1) * Math.sign(diff);
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
